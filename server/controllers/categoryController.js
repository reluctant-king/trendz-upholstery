const Category = require('../models/Category');
const Project = require('../models/Project');
const { uniqueSlug } = require('../utils/slugify');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  const withCount = await Promise.all(
    categories.map(async (c) => {
      const count = await Project.countDocuments({ categoryName: c.name });
      return { ...c.toObject(), projectCount: count };
    })
  );
  res.json({ categories: withCount });
};

const createCategory = async (req, res) => {
  const slug = await uniqueSlug(Category, req.body.name || 'category');
  const category = await Category.create({ ...req.body, slug });
  res.status(201).json({ category });
};

const updateCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  const updates = { ...req.body };
  if (req.body.name && req.body.name !== category.name) {
    updates.slug = await uniqueSlug(Category, req.body.name, category._id);
  }
  Object.assign(category, updates);
  const saved = await category.save();
  res.json({ category: saved });
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Category deleted', category });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
