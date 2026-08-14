const { uploadImage, deleteImage } = require('../utils/imageUpload');

const uploadFiles = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const folder = req.body.folder || 'general';
  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const { url, publicId } = await uploadImage(file, folder);
        return { url, publicId, name: file.originalname, size: file.size };
      })
    );
    res.status(201).json({ images: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFile = async (req, res) => {
  const { publicId, url } = req.body;
  if (!publicId && !url) {
    return res.status(400).json({ message: 'publicId or url is required' });
  }
  try {
    if (publicId) {
      await deleteImage(publicId);
    } else if (url && url.startsWith('/uploads/')) {
      const fs = require('fs');
      const path = require('path');
      const localPath = path.join(__dirname, '..', url);
      if (fs.existsSync(localPath)) fs.unlink(localPath, () => {});
    }
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { uploadFiles, deleteFile };
