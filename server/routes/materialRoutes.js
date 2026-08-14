const express = require('express');
const router = express.Router();
const { getMaterials, createMaterial, updateMaterial, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middleware/auth');

router.route('/').get(getMaterials).post(protect, createMaterial);
router.route('/:id').put(protect, updateMaterial).delete(protect, deleteMaterial);

module.exports = router;
