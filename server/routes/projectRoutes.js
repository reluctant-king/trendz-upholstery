const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.route('/').get(getProjects).post(protect, createProject);
router.get('/slug/:slug', getProjectBySlug);
router.route('/:id').get(getProjectById).put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
