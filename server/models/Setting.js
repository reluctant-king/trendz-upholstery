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
  whatsappNumber: '919999999999',
  phoneNumber: '+91 99999 99999',
  email: 'hello@trendzupholstery.com',
  address: 'MG Road, Kochi, Kerala',
  businessHours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  instagram: '',
  facebook: '',
  youtube: '',
  mapEmbedUrl: '',
  metaDescription:
    'Premium upholstery and custom furniture studio. Sofa sets, upholstery, curtains, seat covers and custom furniture crafted to fit your space.',
};

module.exports = { Setting: mongoose.model('Setting', settingSchema), defaultSettings };
