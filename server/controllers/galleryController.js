const GalleryImage = require('../models/GalleryImage');

const getGalleryImages = async (req, res) => {
  const query = {};
  if (req.query.category) query.category = req.query.category;
  const images = await GalleryImage.find(query).sort({ createdAt: -1 });
  res.json({ images });
};

const createGalleryImage = async (req, res) => {
  const { url, publicId, alt, title, category, project, featured } = req.body;
  if (!url) return res.status(400).json({ message: 'Image url is required' });
  const image = await GalleryImage.create({ url, publicId, alt, title, category, project, featured });
  res.status(201).json({ image });
};

const updateGalleryImage = async (req, res) => {
  const image = await GalleryImage.findById(req.params.id);
  if (!image) return res.status(404).json({ message: 'Image not found' });
  Object.assign(image, req.body);
  const saved = await image.save();
  res.json({ image: saved });
};

const deleteGalleryImage = async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) return res.status(404).json({ message: 'Image not found' });
  res.json({ message: 'Image deleted', image });
};

module.exports = { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage };
