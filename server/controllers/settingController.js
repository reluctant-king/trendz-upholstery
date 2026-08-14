const { Setting, defaultSettings } = require('../models/Setting');

const getAllSettings = async (req, res) => {
  const rows = await Setting.find();
  const map = {};
  rows.forEach((r) => {
    map[r.key] = r.value;
  });
  res.json({ settings: { ...defaultSettings, ...map } });
};

const updateSetting = async (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ message: 'key is required' });
  let setting = await Setting.findOne({ key });
  if (setting) {
    setting.value = value;
    await setting.save();
  } else {
    setting = await Setting.create({ key, value });
  }
  res.json({ setting });
};

const updateManySettings = async (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ message: 'settings object is required' });
  }
  const ops = Object.entries(settings).map(async ([key, value]) => {
    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      await Setting.create({ key, value });
    }
  });
  await Promise.all(ops);
  res.json({ message: 'Settings saved' });
};

module.exports = { getAllSettings, updateSetting, updateManySettings };
