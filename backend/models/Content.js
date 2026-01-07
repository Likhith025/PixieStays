const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true }, // e.g., "home_hero_title"
    value: { type: mongoose.Schema.Types.Mixed, required: true }, // Can be string or object
    section: { type: String, default: 'general' }, // e.g., "home", "about", "contact"
    label: { type: String }, // Human readable label for Admin UI
    type: { type: String, default: 'text' }, // text, textarea, image, etc.
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
