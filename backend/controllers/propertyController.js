const Property = require('../models/Property');

const getProperties = async (req, res) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.json(properties);
    } catch (err) {
        res.status(500).json({ message: "Error fetching properties" });
    }
};

const getPropertyDiff = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Property not found" });
        res.json(property);
    } catch (err) {
        res.status(500).json({ message: "Error fetching property" });
    }
}

const createProperty = async (req, res) => {
    try {
        const newProperty = new Property(req.body);
        await newProperty.save();
        res.status(201).json(newProperty);
    } catch (err) {
        res.status(400).json({ message: "Error creating property", error: err.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProperty);
    } catch (err) {
        res.status(400).json({ message: "Error updating property" });
    }
};

const deleteProperty = async (req, res) => {
    try {
        await Property.findByIdAndDelete(req.params.id);
        res.json({ message: "Property deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting property" });
    }
};

module.exports = { getProperties, getPropertyDiff, createProperty, updateProperty, deleteProperty };
