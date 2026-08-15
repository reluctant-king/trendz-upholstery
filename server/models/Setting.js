const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

const defaultSettings = {
  businessName: 'Trendz Upholstery',
  tagline: 'Custom Upholstery & Interiors',
  logo: '',
  whatsappNumber: '919999999999',
  phoneNumber: '+91 99999 99999',
  email: 'hello@trendzupholstery.com',
  adminEmail: 'admin@trendz.com',
  address: 'MG Road, Kochi, Kerala',
  businessHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  instagram: '',
  facebook: '',
  youtube: '',
  mapEmbedUrl: '',
  metaDescription:
    'Premium upholstery and custom furniture studio. Sofa sets, upholstery, curtains, seat covers and custom furniture crafted to fit your space.',
  heroHeading: 'Furniture That Feels Like Home.',
  heroDescription:
    'Premium sofas, custom upholstery, curtains and furniture solutions crafted around your style.',
  heroButtonText: 'View Our Work',
  heroBaseImage: '',
  heroRevealImage: '',
  aboutShortDescription:
    'We believe furniture should not simply fill a room. It should reflect the people who live there.',
  featuredWorkTitle: 'Our Work',
  servicesTitle: 'What We Create',
  testimonialsTitle: 'What Our Customers Say',
  aboutHeading: 'Your Furniture. Our Craftsmanship.',
  aboutDescription:
    'Trendz Upholstery started with a simple belief: that good furniture should not be thrown away, and new furniture should not have to look like everyone else\u2019s. We are a dedicated team of upholsterers, pattern cutters and finishers who take pride in bringing pieces back to life and building new ones from scratch. From complete sofa sets and curtains to car seat covers and custom cushions, we guide every project from fabric selection to final finishing \u2014 made to fit your space, crafted to last.',
  aboutImage: '',
  yearsExperience: '15+',
  projectsCompleted: '500+',
};

module.exports = { Setting: mongoose.model('Setting', settingSchema), defaultSettings };
