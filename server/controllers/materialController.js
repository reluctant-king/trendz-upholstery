const Material = require('../models/Material');
const { uniqueSlug } = require('../utils/slugify');

const getMaterials = async (req, res) => {
  const query = {};
  if (req.query.published !== undefined) query.published = req.query.published === 'true';
  const materials = await Material.find(query).sort({ createdAt: 1 });
  res.json({ materials });
};

const createMaterial = async (req, res) => {
  const slug = await uniqueSlug(Material, req.body.name || 'material');
  const material = await Material.create({
    ...req.body,
    slug,
    colors: Array.isArray(req.body.colors) ? req.body.colors : req.body.colors ? req.body.colors.split(',') : [],
  });
  res.status(201).json({ material });
};

const updateMaterial = async (req, res) => {
  const material = await Material.findById(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  const updates = { ...req.body };
  if (req.body.name && req.body.name !== material.name) {
    updates.slug = await uniqueSlug(Material, req.body.name, material._id);
  }
  Object.assign(material, updates);
  const saved = await material.save();
  res.json({ material: saved });
};

const deleteMaterial = async (req, res) => {
  const material = await Material.findByIdAndDelete(req.params.id);
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json({ message: 'Material deleted', material });
};

module.exports = { getMaterials, createMaterial, updateMaterial, deleteMaterial };
