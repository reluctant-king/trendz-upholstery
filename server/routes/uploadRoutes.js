const express = require('express');
const router = express.Router();
const { uploadFiles, deleteFile } = require('../controllers/uploadController');
const { upload } = require('../middleware/upload');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.array('images', 12), uploadFiles);
router.delete('/', protect, deleteFile);

module.exports = router;
