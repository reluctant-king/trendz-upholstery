const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'trendz-dev-secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin || !(await admin.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({
    token: signToken(admin._id),
    admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
  });
};

const getMe = async (req, res) => {
  res.json({ admin: { id: req.admin._id, name: req.admin.name, email: req.admin.email, role: req.admin.role } });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  }
  const admin = await Admin.findById(req.admin._id);
  if (!admin || !(await admin.matchPassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  admin.password = newPassword;
  await admin.save();
  res.json({ message: 'Password updated successfully' });
};

module.exports = { loginAdmin, getMe, changePassword };
