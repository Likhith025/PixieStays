const Content = require('../models/Content');

const getAllContent = async (req, res) => {
    try {
        const contents = await Content.find({});
        // Return as object { key: value } for easier frontend consumption
        const contentMap = {};
        contents.forEach(item => {
            contentMap[item.key] = item.value;
        });
        res.json(contentMap);
    } catch (err) {
        res.status(500).json({ message: "Error fetching content" });
    }
};

const updateContent = async (req, res) => {
    try {
        const { key, value, section, label, type } = req.body;
        const content = await Content.findOneAndUpdate(
            { key },
            { value, section, label, type },
            { upsert: true, new: true }
        );
        res.json(content);
    } catch (err) {
        res.status(500).json({ message: "Error updating content" });
    }
};

module.exports = { getAllContent, updateContent };
