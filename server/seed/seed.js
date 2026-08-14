require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Project = require('../models/Project');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');
const Material = require('../models/Material');
const Collection = require('../models/Collection');
const GalleryImage = require('../models/GalleryImage');
const { Setting, defaultSettings } = require('../models/Setting');
const { slugify } = require('../utils/slugify');
const { P } = require('./data');

const categories = [
  { name: 'Sofa Sets', description: 'Complete sofa sets designed, customized and upholstered for your home.', image: P.sofa1 },
  { name: 'Sofa Upholstery', description: 'Give your existing sofa a completely new look.', image: P.sofa2 },
  { name: 'Curtains', description: 'Custom curtains with carefully selected fabrics, colors and finishes.', image: P.bedroom4 },
  { name: 'Seat Covers', description: 'Tailored seat covers designed for comfort, durability and style.', image: P.living2 },
  { name: 'Chairs', description: 'Premium upholstery solutions for chairs and dining furniture.', image: P.chair },
  { name: 'Cushions', description: 'Decorative and functional cushions made to match your interiors.', image: P.bedroom3 },
  { name: 'Custom Furniture', description: 'Unique furniture pieces built and upholstered to your specification.', image: P.living3 },
  { name: 'Car Interiors', description: 'Custom-fit car seat covers with professional finishing.', image: P.car2 },
  { name: 'Headboards', description: 'Tailored upholstered headboards for a complete bedroom look.', image: P.bedroom },
  { name: 'Other Works', description: 'Specialized and custom upholstery projects.', image: P.living7 },
];

const services = [
  { title: 'Sofa Sets', description: 'Complete sofa sets designed, customized and upholstered for your home.', features: ['Custom size and shape', 'Frame & cushioning', 'Fabric selection'], image: P.sofa1 },
  { title: 'Curtains', description: 'Custom curtains with carefully selected fabrics, colors and finishes.', features: ['Custom measurement', 'Lining & hardware', 'Sewing & finishing'], image: P.bedroom4 },
  { title: 'Seat Covers', description: 'Tailored seat covers designed for comfort, durability and style.', features: ['Perfect fit', 'Washable fabrics', 'Durable stitching'], image: P.living2 },
  { title: 'Sofa Upholstery', description: 'Give your existing furniture a completely new look.', features: ['New fabric', 'Cushion replacement', 'Frame repair'], image: P.sofa2 },
  { title: 'Custom Cushions', description: 'Decorative and functional cushions made to match your interiors.', features: ['Custom sizes', 'Variety of fabrics', 'Matching sets'], image: P.bedroom3 },
  { title: 'Chair & Dining Upholstery', description: 'Premium upholstery solutions for chairs and dining furniture.', features: ['Dining chairs', 'Office chairs', 'Recliners'], image: P.chair },
  { title: 'Car Seat Covers', description: 'Custom-fit seat covers with professional finishing.', features: ['Custom fit', 'Quality material', 'Easy install'], image: P.car2 },
  { title: 'Custom Projects', description: 'Unique upholstery solutions based on your requirements.', features: ['Any project size', 'Fabric matching', 'On-site work'], image: P.living3 },
];

const materials = [
  { name: 'Premium Velvet', description: 'Soft texture with a luxurious appearance, ideal for statement sofas and accent chairs.', colors: ['Navy', 'Mustard', 'Forest', 'Blush'], image: P.fabric4 },
  { name: 'Linen', description: 'Breathable, natural weave with a relaxed and timeless look.', colors: ['Cream', 'Beige', 'Grey', 'White'], image: P.fabric1 },
  { name: 'Cotton', description: 'Soft, versatile and easy to live with. A dependable everyday choice.', colors: ['White', 'Beige', 'Olive', 'Navy'], image: P.fabric2 },
  { name: 'Leather', description: 'Full-grain and bonded leather options for a refined, long-lasting finish.', colors: ['Tan', 'Black', 'Cognac', 'Brown'], image: P.living4 },
  { name: 'Suede', description: 'Soft, matte texture with an understated, premium feel.', colors: ['Charcoal', 'Grey', 'Sand', 'Terracotta'], image: P.fabric3 },
  { name: 'Textured Fabric', description: 'Woven textures that add depth and character to any piece.', colors: ['Grey', 'Beige', 'Rust', 'Charcoal'], image: P.texture },
  { name: 'Performance Fabric', description: 'Stain-resistant and durable, made for busy homes and daily use.', colors: ['Beige', 'Grey', 'Navy', 'Mustard'], image: P.living5 },
  { name: 'Custom Fabric', description: 'Bring your own fabric or let us source a unique material for you.', colors: ['Any color', 'Any texture', 'Any print'], image: P.fabric2 },
];

const collections = [
  { name: 'Contemporary', tagline: 'Clean lines, current forms', description: 'Modern silhouettes in refined neutral tones for today\'s living spaces.', image: P.living3 },
  { name: 'Classic', tagline: 'Timeless elegance', description: 'Traditional shapes and detailing, made to feel right at home.', image: P.sofa1 },
  { name: 'Minimal', tagline: 'Less, but better', description: 'Quiet forms and simple silhouettes for calm, uncluttered interiors.', image: P.living2 },
  { name: 'Luxury', tagline: 'Refined materials', description: 'Rich textures, tailored finishes and premium fabrics.', image: P.living1 },
  { name: 'Modern', tagline: 'Designed for today', description: 'Bold, current designs with comfort built in.', image: P.living6 },
  { name: 'Custom', tagline: 'Made your way', description: 'Your dimensions, your fabrics, your vision — crafted to fit.', image: P.living7 },
];

const testimonials = [
  { customerName: 'Anjali Menon', service: 'Sofa Upholstery', rating: 5, review: 'Excellent finishing and very professional work. The sofa looks completely new — even better than the day we bought it.' },
  { customerName: 'Rahul Nair', service: 'Custom Sofa Set', rating: 5, review: 'They designed and built a complete sofa set for our new living room. Perfect fit, premium fabric and delivered on time.' },
  { customerName: 'Priya Thomas', service: 'Curtains', rating: 5, review: 'Beautiful stitching and great fabric selection advice. The curtains transformed the entire look of our hall.' },
  { customerName: 'Suresh Pillai', service: 'Car Seat Covers', rating: 5, review: 'Custom-fit covers with excellent finishing. The team measured everything and the fit is perfect.' },
  { customerName: 'Divya Krishnan', service: 'Cushions', rating: 5, review: 'Lovely custom cushions made to match my living room colour scheme. Great attention to detail.' },
  { customerName: 'Arjun Varma', service: 'Dining Chair Upholstery', rating: 5, review: 'Very reliable and reasonably priced. All six dining chairs reupholstered beautifully.' },
];

const projects = [
  {
    title: 'Modern L-Shape Sofa Set',
    categoryName: 'Sofa Sets',
    description: 'Complete L-shape sofa set designed and upholstered in premium textured fabric with deep, supportive cushioning and custom stitching details.',
    location: 'Panampilly Nagar, Kochi',
    materials: 'Solid hardwood frame, high-density foam',
    fabric: 'Premium textured fabric',
    color: 'Beige',
    services: ['Custom sofa set', 'Cushioning', 'Tailored finishing'],
    coverImage: P.sofa1,
    beforeImage: P.sofa3,
    afterImage: P.sofa1,
    galleryImages: [{ url: P.living1 }, { url: P.living2 }, { url: P.living3 }],
    featured: true,
    completionDate: new Date('2026-03-15'),
  },
  {
    title: 'Complete Reupholstery — Living Room Sofa',
    categoryName: 'Sofa Upholstery',
    description: 'Complete transformation of an existing sofa set using premium fabric, new cushioning and custom finishing.',
    location: 'Kakkanad, Kochi',
    materials: 'Foam replacement, webbing',
    fabric: 'Velvet',
    color: 'Navy',
    services: ['Complete reupholstery', 'Cushion replacement'],
    coverImage: P.sofa2,
    beforeImage: P.living7,
    afterImage: P.sofa2,
    galleryImages: [{ url: P.living4 }, { url: P.living5 }],
    featured: true,
    completionDate: new Date('2026-02-20'),
  },
  {
    title: 'Elegant Curtains with Sheer Lining',
    categoryName: 'Curtains',
    description: 'Floor-to-ceiling curtains with sheer lining, custom-stitched to fit the space perfectly.',
    location: 'Edapally, Kochi',
    materials: 'Cotton blend with sheer lining',
    fabric: 'Cotton blend',
    color: 'Cream',
    services: ['Curtain sewing', 'Lining', 'Hardware fitting'],
    coverImage: P.bedroom4,
    galleryImages: [{ url: P.bedroom }, { url: P.bedroom3 }],
    completionDate: new Date('2026-01-30'),
  },
  {
    title: 'Tailored Car Seat Covers',
    categoryName: 'Car Interiors',
    description: 'Custom-fit car seat covers stitched and installed with a professional, seamless finish.',
    location: 'Fort Kochi',
    materials: 'Leatherette with breathable mesh',
    fabric: 'Leatherette',
    color: 'Black',
    services: ['Car seat covers', 'Installation'],
    coverImage: P.car2,
    galleryImages: [{ url: P.car1 }, { url: P.car3 }],
    completionDate: new Date('2026-02-10'),
  },
  {
    title: 'Custom Dining Chair Upholstery',
    categoryName: 'Chairs',
    description: 'Six dining chairs reupholstered with stain-resistant performance fabric and refreshed foam seating.',
    location: 'Marine Drive, Kochi',
    materials: 'Performance fabric, new foam',
    fabric: 'Performance fabric',
    color: 'Grey',
    services: ['Chair upholstery', 'Foam refresh'],
    coverImage: P.chair,
    beforeImage: P.dining,
    afterImage: P.chair,
    galleryImages: [{ url: P.dining2 }, { url: P.chair }],
    completionDate: new Date('2026-01-18'),
  },
  {
    title: 'Upholstered Headboard & Bedroom Set',
    categoryName: 'Headboards',
    description: 'Custom upholstered headboard with piped detail, matched with cushioning and fabric across the room.',
    location: 'Vyttila, Kochi',
    materials: 'MDF base, foam, premium velvet',
    fabric: 'Velvet',
    color: 'Terracotta',
    services: ['Headboard upholstery', 'Cushion set'],
    coverImage: P.bedroom,
    galleryImages: [{ url: P.bedroom2 }, { url: P.bedroom3 }],
    completionDate: new Date('2025-12-22'),
  },
  {
    title: 'Recliner Reupholstery',
    categoryName: 'Sofa Upholstery',
    description: 'Full reupholstery of a recliner with durable leather-look fabric, keeping the mechanism intact.',
    location: 'Palarivattom, Kochi',
    materials: 'Leather-look fabric',
    fabric: 'Leatherette',
    color: 'Cognac',
    services: ['Recliner upholstery', 'Mechanism service'],
    coverImage: P.living4,
    galleryImages: [{ url: P.living1 }, { url: P.armchair }],
    completionDate: new Date('2025-11-12'),
  },
  {
    title: 'Luxury Velvet Sofa Set',
    categoryName: 'Sofa Sets',
    description: 'Statement velvet sofa set with deep button detailing, built to order for a premium living room.',
    location: 'Infopark, Kochi',
    materials: 'Hardwood frame, high-resilience foam',
    fabric: 'Velvet',
    color: 'Mustard',
    services: ['Custom sofa set', 'Button detailing'],
    coverImage: P.living6,
    galleryImages: [{ url: P.living3 }, { url: P.living5 }],
    featured: true,
    completionDate: new Date('2026-04-05'),
  },
  {
    title: 'Custom Cushion Collection',
    categoryName: 'Cushions',
    description: 'A matching collection of decorative and functional cushions in custom sizes and fabrics.',
    location: 'Chottanikkara, Kochi',
    materials: 'Cotton and linen blends',
    fabric: 'Cotton & linen',
    color: 'Olive',
    services: ['Custom cushions', 'Covers & inserts'],
    coverImage: P.bedroom3,
    galleryImages: [{ url: P.fabric1 }, { url: P.bedroom }],
    completionDate: new Date('2026-02-28'),
  },
  {
    title: 'Bespoke Corner Sofa',
    categoryName: 'Custom Furniture',
    description: 'Corner sofa built from scratch to the client\'s exact dimensions and fabric choice.',
    location: 'Tripunithura, Kochi',
    materials: 'Engineered wood frame, foam',
    fabric: 'Linen',
    color: 'Cream',
    services: ['Custom furniture', 'Upholstery', 'Delivery & install'],
    coverImage: P.living3,
    galleryImages: [{ url: P.living2 }, { url: P.sofa1 }],
    completionDate: new Date('2026-03-25'),
  },
  {
    title: 'Fabric Seat Covers for Home',
    categoryName: 'Seat Covers',
    description: 'Tailored fabric seat covers for a living room sofa, removable and washable.',
    location: 'Kalamassery, Kochi',
    materials: 'Washable cotton',
    fabric: 'Cotton',
    color: 'Grey',
    services: ['Seat covers', 'Custom fitting'],
    coverImage: P.living2,
    galleryImages: [{ url: P.living5 }, { url: P.living1 }],
    completionDate: new Date('2026-01-05'),
  },
  {
    title: 'Studio Transformation — Full Living Room',
    categoryName: 'Other Works',
    description: 'End-to-end interior upholstery: sofa, armchairs, curtains and cushions across one living space.',
    location: 'Kochi',
    materials: 'Mixed premium fabrics',
    fabric: 'Various',
    color: 'Mixed neutrals',
    services: ['Interior upholstery', 'Curtains', 'Cushions'],
    coverImage: P.living7,
    galleryImages: [{ url: P.living1 }, { url: P.living4 }, { url: P.living5 }],
    featured: true,
    completionDate: new Date('2026-04-18'),
  },
];

const galleryImages = [
  { url: P.sofa1, alt: 'Modern beige sofa set', title: 'Modern L-Shape Sofa', category: 'Sofa Sets', featured: true },
  { url: P.sofa2, alt: 'Navy velvet reupholstered sofa', title: 'Reupholstered Sofa', category: 'Sofa Upholstery', featured: true },
  { url: P.living1, alt: 'Luxury living room', title: 'Luxury Living Room', category: 'Custom Furniture' },
  { url: P.living2, alt: 'Minimal living room', title: 'Minimal Living Room', category: 'Seat Covers' },
  { url: P.living3, alt: 'Modern corner sofa', title: 'Corner Sofa', category: 'Custom Furniture', featured: true },
  { url: P.chair, alt: 'Upholstered dining chair', title: 'Dining Chair', category: 'Chairs' },
  { url: P.armchair, alt: 'Accent armchair', title: 'Accent Armchair', category: 'Chairs' },
  { url: P.bedroom, alt: 'Upholstered headboard', title: 'Headboard', category: 'Headboards' },
  { url: P.bedroom4, alt: 'Curtains in a bedroom', title: 'Custom Curtains', category: 'Curtains' },
  { url: P.car2, alt: 'Custom car seat covers', title: 'Car Seat Covers', category: 'Car Interiors' },
  { url: P.bedroom3, alt: 'Cushion collection on bed', title: 'Cushion Collection', category: 'Cushions' },
  { url: P.living6, alt: 'Velvet sofa set', title: 'Velvet Sofa Set', category: 'Sofa Sets' },
];

const adminPassword = 'admin123';

async function seed() {
  try {
    await connectDB();

    await Promise.all([
      Project.deleteMany({}),
      Category.deleteMany({}),
      Service.deleteMany({}),
      Testimonial.deleteMany({}),
      Material.deleteMany({}),
      Collection.deleteMany({}),
      GalleryImage.deleteMany({}),
      Setting.deleteMany({}),
    ]);

    const existing = await Admin.findOne({ email: 'admin@trendz.com' });
    if (existing) {
      existing.password = adminPassword;
      await existing.save();
    } else {
      await Admin.create({
        name: 'Trendz Admin',
        email: 'admin@trendz.com',
        password: adminPassword,
        role: 'admin',
      });
    }

    const insertedCategories = await Category.insertMany(
      categories.map((c) => ({ ...c, slug: slugify(c.name) }))
    );

    await Service.insertMany(
      services.map((s) => ({ ...s, slug: slugify(s.title) }))
    );

    await Material.insertMany(
      materials.map((m) => ({ ...m, slug: slugify(m.name) }))
    );

    await Collection.insertMany(
      collections.map((c) => ({ ...c, slug: slugify(c.name) }))
    );

    await Testimonial.insertMany(testimonials);

    const categoryMap = {};
    insertedCategories.forEach((c) => {
      categoryMap[c.name] = c._id;
    });

    await Project.insertMany(
      projects.map((p) => ({
        ...p,
        slug: slugify(p.title),
        category: categoryMap[p.categoryName] || null,
      }))
    );

    await GalleryImage.insertMany(galleryImages);

    await Setting.deleteMany({});
    await Promise.all(
      Object.entries(defaultSettings).map(([key, value]) => Setting.create({ key, value }))
    );

    console.log('✅ Database seeded successfully');
    console.log('   Admin login → admin@trendz.com / admin123');
    console.log(`   Categories: ${insertedCategories.length}`);
    console.log(`   Projects:   ${projects.length}`);
    console.log(`   Services:   ${services.length}`);
    console.log(`   Materials:  ${materials.length}`);
    console.log(`   Collections:${collections.length}`);
    console.log(`   Testimonials: ${testimonials.length}`);
    console.log(`   Gallery:    ${galleryImages.length}`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
