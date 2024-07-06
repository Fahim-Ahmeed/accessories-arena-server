const mongoose = require('mongoose');

const repairServiceSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true },
  deviceType: { type: String, required: true },
  deviceBrand: { type: String, required: true },
  deviceModel: { type: String, required: true },
  issueDescription: { type: String, required: true },
  preferredRepairDate: { type: Date, required: true },
  additionalNotes: { type: String },
  images: [{ type: String }],
});

const RepairService = mongoose.model('RepairService', repairServiceSchema);

module.exports = RepairService;
