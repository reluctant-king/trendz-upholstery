require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const mongoose = require('mongoose');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const connectDB = require('../config/db');
const Project = require('../models/Project');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Material = require('../models/Material');
const Collection = require('../models/Collection');
const GalleryImage = require('../models/GalleryImage');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const MAPPING_FILE = path.join(__dirname, 'cloudinary-mapping.json');

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(UPLOADS_DIR, `temp-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`);
    const file = fs.createWriteStream(filePath);
    const client = url.startsWith('https') ? https : http;
    client
      .get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          file.close();
          fs.unlinkSync(filePath);
          return downloadImage(response.headers.location).then(resolve).catch(reject);
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filePath);
        });
      })
      .on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
  });
}

async function uploadToCloudinary(filePath, folder) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `trendz/${folder}`,
    resource_type: 'image',
    transformation: [
      { fetch_format: 'auto', quality: 'auto' },
      { width: 2000, crop: 'limit' },
    ],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

async function uploadLocalFile(filePath, folder) {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: `trendz/${folder}`,
    resource_type: 'image',
    transformation: [
      { fetch_format: 'auto', quality: 'auto' },
      { width: 2000, crop: 'limit' },
    ],
  });
  return { url: result.secure_url, publicId: result.public_id };
}

async function migrate() {
  if (!isCloudinaryConfigured()) {
    console.error('❌ Cloudinary is not configured. Set CLOUDINARY_* env vars first.');
    process.exit(1);
  }

  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    const mapping = {};

    // ── 1. Collect all unique image URLs from every collection ──
    const collections = [
      { model: Category, name: 'Category', imageField: 'image' },
      { model: Service, name: 'Service', imageField: 'image' },
      { model: Material, name: 'Material', imageField: 'image' },
      { model: Collection, name: 'Collection', imageField: 'image' },
    ];

    const allUrls = new Set();

    // Single-image fields
    for (const col of collections) {
      const docs = await col.model.find({});
      for (const doc of docs) {
        const url = doc[col.imageField];
        if (url && url.startsWith('http')) allUrls.add(url);
      }
    }

    // Projects — coverImage, beforeImage, afterImage, galleryImages[].url
    const projects = await Project.find({});
    for (const p of projects) {
      if (p.coverImage && p.coverImage.startsWith('http')) allUrls.add(p.coverImage);
      if (p.beforeImage && p.beforeImage.startsWith('http')) allUrls.add(p.beforeImage);
      if (p.afterImage && p.afterImage.startsWith('http')) allUrls.add(p.afterImage);
      if (p.galleryImages && p.galleryImages.length) {
        for (const img of p.galleryImages) {
          if (img.url && img.url.startsWith('http')) allUrls.add(img.url);
        }
      }
    }

    // Gallery images
    const galleryImages = await GalleryImage.find({});
    for (const g of galleryImages) {
      if (g.url && g.url.startsWith('http')) allUrls.add(g.url);
    }

    console.log(`📸 Found ${allUrls.size} unique image URLs to migrate\n`);

    // ── 2. Upload each unique URL to Cloudinary ──
    let count = 0;
    for (const url of allUrls) {
      count++;
      console.log(`[${count}/${allUrls.size}] Downloading: ${url.slice(0, 80)}...`);
      try {
        const tempPath = await downloadImage(url);
        const folder = url.includes('car') ? 'car-interiors' : 'portfolio';
        const result = await uploadToCloudinary(tempPath, folder);
        mapping[url] = result;
        console.log(`  ✅ Uploaded → ${result.url.slice(0, 80)}...`);
        fs.unlinkSync(tempPath);
      } catch (err) {
        console.error(`  ❌ Failed: ${err.message}`);
      }
    }

    // ── 3. Upload local files from server/uploads ──
    console.log('\n📁 Migrating local uploads...');
    const localFiles = [];
    if (fs.existsSync(path.join(UPLOADS_DIR, 'projects'))) {
      const projectFiles = fs.readdirSync(path.join(UPLOADS_DIR, 'projects'));
      for (const file of projectFiles) {
        localFiles.push({ filePath: path.join(UPLOADS_DIR, 'projects', file), folder: 'projects' });
      }
    }
    if (fs.existsSync(path.join(UPLOADS_DIR, 'gallery'))) {
      const galleryFiles = fs.readdirSync(path.join(UPLOADS_DIR, 'gallery'));
      for (const file of galleryFiles) {
        localFiles.push({ filePath: path.join(UPLOADS_DIR, 'gallery', file), folder: 'gallery' });
      }
    }

    const localMapping = {};
    for (const { filePath: fp, folder } of localFiles) {
      console.log(`  Uploading local: ${path.basename(fp)}`);
      try {
        const result = await uploadLocalFile(fp, folder);
        const localUrl = `/uploads/${folder}/${path.basename(fp)}`;
        localMapping[localUrl] = result;
        console.log(`  ✅ Uploaded → ${result.url.slice(0, 80)}...`);
      } catch (err) {
        console.error(`  ❌ Failed: ${err.message}`);
      }
    }

    // ── 4. Update database records ──
    console.log('\n💾 Updating database records...');

    const fullMapping = { ...mapping, ...localMapping };

    function replaceUrl(url) {
      if (fullMapping[url]) return fullMapping[url].url;
      return url;
    }

    function replacePublicId(url) {
      if (fullMapping[url]) return fullMapping[url].publicId;
      return '';
    }

    // Categories
    const cats = await Category.find({});
    for (const cat of cats) {
      if (cat.image && fullMapping[cat.image]) {
        cat.image = fullMapping[cat.image].url;
        await cat.save();
      }
    }
    console.log(`  ✅ Categories updated: ${cats.length}`);

    // Services
    const svcs = await Service.find({});
    for (const svc of svcs) {
      if (svc.image && fullMapping[svc.image]) {
        svc.image = fullMapping[svc.image].url;
        await svc.save();
      }
    }
    console.log(`  ✅ Services updated: ${svcs.length}`);

    // Materials
    const mats = await Material.find({});
    for (const mat of mats) {
      if (mat.image && fullMapping[mat.image]) {
        mat.image = fullMapping[mat.image].url;
        await mat.save();
      }
    }
    console.log(`  ✅ Materials updated: ${mats.length}`);

    // Collections
    const cols = await Collection.find({});
    for (const col of cols) {
      if (col.image && fullMapping[col.image]) {
        col.image = fullMapping[col.image].url;
        await col.save();
      }
    }
    console.log(`  ✅ Collections updated: ${cols.length}`);

    // Projects
    for (const p of projects) {
      let changed = false;
      if (p.coverImage && fullMapping[p.coverImage]) {
        p.coverImage = fullMapping[p.coverImage].url;
        changed = true;
      }
      if (p.beforeImage && fullMapping[p.beforeImage]) {
        p.beforeImage = fullMapping[p.beforeImage].url;
        changed = true;
      }
      if (p.afterImage && fullMapping[p.afterImage]) {
        p.afterImage = fullMapping[p.afterImage].url;
        changed = true;
      }
      if (p.galleryImages && p.galleryImages.length) {
        for (const img of p.galleryImages) {
          if (fullMapping[img.url]) {
            img.publicId = fullMapping[img.url].publicId;
            img.url = fullMapping[img.url].url;
          }
        }
        changed = true;
      }
      if (changed) await p.save();
    }
    console.log(`  ✅ Projects updated: ${projects.length}`);

    // Gallery images
    for (const g of galleryImages) {
      if (fullMapping[g.url]) {
        g.publicId = fullMapping[g.url].publicId;
        g.url = fullMapping[g.url].url;
        await g.save();
      }
    }
    console.log(`  ✅ Gallery images updated: ${galleryImages.length}`);

    // ── 5. Save mapping for seed script ──
    fs.writeFileSync(MAPPING_FILE, JSON.stringify(fullMapping, null, 2));
    console.log(`\n📄 Mapping saved to ${MAPPING_FILE}`);

    console.log('\n🎉 Migration complete! All images are now on Cloudinary.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
