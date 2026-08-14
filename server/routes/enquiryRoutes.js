const express = require('express');
const router = express.Router();
const {
  uploadEnquiryImages,
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/upload', upload.array('images', 6), uploadEnquiryImages);
router.route('/').post(createEnquiry).get(protect, getEnquiries);
router.route('/:id').get(protect, getEnquiry).put(protect, updateEnquiry).delete(protect, deleteEnquiry);

module.exports = router;
