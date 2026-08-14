const Collection = require('../models/Collection');
const { uniqueSlug } = require('../utils/slugify');

const getCollections = async (req, res) => {
  const query = {};
  if (req.query.published !== undefined) query.published = req.query.published === 'true';
  const collections = await Collection.find(query).sort({ createdAt: 1 });
  res.json({ collections });
};

const createCollection = async (req, res) => {
  const slug = await uniqueSlug(Collection, req.body.name || 'collection');
  const collection = await Collection.create({ ...req.body, slug });
  res.status(201).json({ collection });
};

const updateCollection = async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) return res.status(404).json({ message: 'Collection not found' });
  const updates = { ...req.body };
  if (req.body.name && req.body.name !== collection.name) {
    updates.slug = await uniqueSlug(Collection, req.body.name, collection._id);
  }
  Object.assign(collection, updates);
  const saved = await collection.save();
  res.json({ collection: saved });
};

const deleteCollection = async (req, res) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);
  if (!collection) return res.status(404).json({ message: 'Collection not found' });
  res.json({ message: 'Collection deleted', collection });
};

module.exports = { getCollections, createCollection, updateCollection, deleteCollection };
