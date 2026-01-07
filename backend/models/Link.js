const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    icon: {
        type: String, // e.g., 'FiFacebook', 'FiInstagram'
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Link', linkSchema);
