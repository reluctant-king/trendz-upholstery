const Project = require('../models/Project');
const { slugify, uniqueSlug } = require('../utils/slugify');

const buildQuery = (req) => {
  const query = {};
  const { category, published, featured, search } = req.query;
  if (published !== undefined) query.published = published === 'true';
  if (featured === 'true') query.featured = true;
  if (category) query.categoryName = category;
  if (search) query.title = { $regex: search, $options: 'i' };
  return query;
};

const getProjects = async (req, res) => {
  const query = buildQuery(req);
  const limit = parseInt(req.query.limit, 10) || 0;
  let result = Project.find(query).sort({ createdAt: -1 });
  if (limit > 0) result = result.limit(limit);
  const projects = await result;
  const total = await Project.countDocuments(query);
  res.json({ projects, total });
};

const getProjectBySlug = async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ project });
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ project });
};

const createProject = async (req, res) => {
  const body = req.body;
  const slug = await uniqueSlug(Project, body.title || 'project');
  const project = await Project.create({
    ...body,
    slug,
    categoryName:
      body.categoryName ||
      (body.category ? String(body.category) : ''),
    galleryImages: body.galleryImages || [],
    services: Array.isArray(body.services) ? body.services : body.services ? body.services.split(',') : [],
  });
  res.status(201).json({ project });
};

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const body = req.body;
  const updates = { ...body };
  if (body.title && body.title !== project.title) {
    updates.slug = await uniqueSlug(Project, body.title, project._id);
  }
  Object.assign(project, updates);
  const saved = await project.save();
  res.json({ project: saved });
};

const deleteProject = async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json({ message: 'Project deleted', project });
};

module.exports = {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
