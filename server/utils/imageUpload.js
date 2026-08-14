const fs = require('fs');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

/**
 * Upload an image file to Cloudinary when configured, otherwise fall back to
 * the local file already written to disk by multer.
 * Returns { url, publicId }.
 */
async function uploadImage(file, folder = 'trendz') {
  if (isCloudinaryConfigured()) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `trendz/${folder}`,
        resource_type: 'image',
        transformation: [
          { fetch_format: 'auto', quality: 'auto' },
          { width: 2000, crop: 'limit' },
        ],
      });
      fs.unlink(file.path, () => {});
      return { url: result.secure_url, publicId: result.public_id };
    } catch (err) {
      console.error('Cloudinary upload failed, falling back to local:', err.message);
    }
  }
  const url = `/uploads/${file.filename}`;
  return { url, publicId: '' };
}

/** Delete an image from Cloudinary (or local disk) by publicId/url + local path. */
async function deleteImage(publicId, localPath) {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return;
    } catch (err) {
      console.error('Cloudinary delete failed:', err.message);
    }
  }
  if (localPath) {
    try {
      fs.unlink(localPath, () => {});
    } catch (err) {
      /* ignore */
    }
  }
}

module.exports = { uploadImage, deleteImage };
