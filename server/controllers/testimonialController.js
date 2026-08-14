const Testimonial = require('../models/Testimonial');

const getTestimonials = async (req, res) => {
  const query = {};
  if (req.query.published !== undefined) query.published = req.query.published === 'true';
  const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });
  res.json({ testimonials });
};

const createTestimonial = async (req, res) => {
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ testimonial });
};

const updateTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
  Object.assign(testimonial, req.body);
  const saved = await testimonial.save();
  res.json({ testimonial: saved });
};

const deleteTestimonial = async (req, res) => {
  const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
  if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
  res.json({ message: 'Testimonial deleted', testimonial });
};

module.exports = { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
