const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    images: [{ type: String }], // Cloudinary URLs
    amenities: [{ type: String }],
    maxGuests: { type: Number, default: 2 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },
    isFeatured: { type: Boolean, default: false },
    availability: [{
        date: { type: Date },
        price: { type: Number },
        isBlocked: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
