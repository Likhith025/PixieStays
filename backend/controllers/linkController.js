const Link = require('../models/Link');

const getLinks = async (req, res) => {
    try {
        const links = await Link.find();
        res.json(links);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLink = async (req, res) => {
    try {
        const newLink = new Link(req.body);
        await newLink.save();
        res.status(201).json(newLink);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteLink = async (req, res) => {
    try {
        await Link.findByIdAndDelete(req.params.id);
        res.json({ message: 'Link deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLink = async (req, res) => {
    try {
        const updatedLink = await Link.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedLink);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getLinks, createLink, updateLink, deleteLink };
