require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const Project = require('./models/Project');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml\n');
});

app.get('/sitemap.xml', async (req, res, next) => {
  try {
    const base = `${req.protocol}://${req.get('host')}`;
    const staticRoutes = ['/', '/our-work', '/services', '/collections', '/materials', '/about', '/contact', '/quote'];
    const projects = await Project.find({ published: true }).select('slug updatedAt');
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    staticRoutes.forEach((route) => {
      xml += `  <url><loc>${base}${route}</loc><changefreq>weekly</changefreq></url>\n`;
    });
    projects.forEach((p) => {
      xml += `  <url><loc>${base}/our-work/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><changefreq>monthly</changefreq></url>\n`;
    });
    xml += '</urlset>';
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/settings', require('./routes/settingRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'trendz-upholstery-api' }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ message: 'Not found' });
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
