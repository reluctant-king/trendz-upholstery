const Service = require('../models/Service');
const { uniqueSlug } = require('../utils/slugify');

const getServices = async (req, res) => {
  const query = {};
  if (req.query.published !== undefined) query.published = req.query.published === 'true';
  const services = await Service.find(query).sort({ createdAt: 1 });
  res.json({ services });
};

const getServiceBySlug = async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json({ service });
};

const createService = async (req, res) => {
  const slug = await uniqueSlug(Service, req.body.title || 'service');
  const service = await Service.create({
    ...req.body,
    slug,
    features: Array.isArray(req.body.features) ? req.body.features : req.body.features ? req.body.features.split(',') : [],
  });
  res.status(201).json({ service });
};

const updateService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  const updates = { ...req.body };
  if (req.body.title && req.body.title !== service.title) {
    updates.slug = await uniqueSlug(Service, req.body.title, service._id);
  }
  Object.assign(service, updates);
  const saved = await service.save();
  res.json({ service: saved });
};

const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json({ message: 'Service deleted', service });
};

module.exports = { getServices, getServiceBySlug, createService, updateService, deleteService };
