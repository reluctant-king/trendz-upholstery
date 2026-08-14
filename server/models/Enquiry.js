const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '', trim: true },
    service: { type: String, default: '' },
    description: { type: String, required: true },
    budget: { type: String, default: '' },
    material: { type: String, default: '' },
    contactMethod: { type: String, default: 'phone' },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Quotation Sent', 'In Progress', 'Completed', 'Closed'],
      default: 'New',
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

enquirySchema.index({ status: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
