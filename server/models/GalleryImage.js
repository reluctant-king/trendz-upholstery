const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    title: { type: String, default: '' },
    category: { type: String, default: '' },
    project: { type: String, default: '' },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
