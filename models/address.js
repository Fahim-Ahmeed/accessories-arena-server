const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    email:{type:String,required:true},
    landmark: { type: String },
    district: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
}, {
    timestamps: true
});

const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
