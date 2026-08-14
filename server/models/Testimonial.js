const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, trim: true },
    service: { type: String, default: '' },
    review: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    image: { type: String, default: '' },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
