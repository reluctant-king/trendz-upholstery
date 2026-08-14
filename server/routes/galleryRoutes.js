const express = require('express');
const router = express.Router();
const { getGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

router.route('/').get(getGalleryImages).post(protect, createGalleryImage);
router.route('/:id').put(protect, updateGalleryImage).delete(protect, deleteGalleryImage);

module.exports = router;
