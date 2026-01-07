const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: false
    },
    guests: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    adminNote: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted', 'Closed'],
        default: 'New'
    }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);
