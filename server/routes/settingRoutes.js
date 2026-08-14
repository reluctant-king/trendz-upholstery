const express = require('express');
const router = express.Router();
const { getAllSettings, updateSetting, updateManySettings } = require('../controllers/settingController');
const { protect } = require('../middleware/auth');

router.get('/', getAllSettings);
router.put('/', protect, updateManySettings);
router.put('/:key', protect, updateSetting);

module.exports = router;
