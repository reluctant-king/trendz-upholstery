const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    alt: { type: String, default: '' },
    title: { type: String, default: '' },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    categoryName: { type: String, default: '' },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    completionDate: { type: Date, default: null },
    materials: { type: String, default: '' },
    fabric: { type: String, default: '' },
    color: { type: String, default: '' },
    services: [{ type: String }],
    coverImage: { type: String, default: '' },
    coverImageAlt: { type: String, default: '' },
    beforeImage: { type: String, default: '' },
    afterImage: { type: String, default: '' },
    galleryImages: [imageSchema],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
  },
  { timestamps: true }
);

projectSchema.index({ category: 1 });
projectSchema.index({ featured: 1, published: 1 });

module.exports = mongoose.model('Project', projectSchema);
