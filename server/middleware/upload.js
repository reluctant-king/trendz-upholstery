const path = require('path');
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = req.body.folder || 'general';
    const target = path.join(uploadDir, folder);
    if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
    cb(null, target);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Only image files (jpg, png, webp, gif, avif) are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

module.exports = { upload, uploadDir };
