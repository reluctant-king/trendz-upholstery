const Enquiry = require('../models/Enquiry');
const { uploadImage } = require('../utils/imageUpload');

const uploadEnquiryImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  try {
    const results = await Promise.all(
      req.files.map(async (file) => {
        const { url, publicId } = await uploadImage(file, 'enquiries');
        return { url, publicId, name: file.originalname };
      })
    );
    res.status(201).json({ images: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createEnquiry = async (req, res) => {
  const { name, phone, description } = req.body;
  if (!name || !phone || !description) {
    return res.status(400).json({ message: 'Name, phone and project description are required' });
  }
  const enquiry = await Enquiry.create({
    ...req.body,
    images: req.body.images || [],
    status: 'New',
  });
  res.status(201).json({ enquiry });
};

const getEnquiries = async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
  res.json({ enquiries });
};

const getEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
  res.json({ enquiry });
};

const updateEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
  Object.assign(enquiry, req.body);
  const saved = await enquiry.save();
  res.json({ enquiry: saved });
};

const deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
  res.json({ message: 'Enquiry deleted', enquiry });
};

module.exports = {
  uploadEnquiryImages,
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
};
