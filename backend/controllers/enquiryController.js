const Enquiry = require('../models/Enquiry');
const Property = require('../models/Property');

// Create a new enquiry (Public)
const createEnquiry = async (req, res) => {
    try {
        const { name, phone, propertyId, guests, description } = req.body;
        const enquiry = new Enquiry({
            name,
            phone,
            propertyId,
            guests,
            description
        });
        await enquiry.save();
        res.status(201).json({ message: "Enquiry submitted successfully", enquiry });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit enquiry" });
    }
};

// Get all enquiries (Admin)
const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().populate('propertyId', 'title').sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch enquiries" });
    }
};

// Update enquiry (Admin) - Status & Admin Note
const updateEnquiry = async (req, res) => {
    try {
        const { status, adminNote } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status, adminNote },
            { new: true }
        );
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: "Failed to update enquiry" });
    }
};

// Delete enquiry (Admin)
const deleteEnquiry = async (req, res) => {
    try {
        await Enquiry.findByIdAndDelete(req.params.id);
        res.json({ message: "Enquiry deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete enquiry" });
    }
};

module.exports = {
    createEnquiry,
    getEnquiries,
    updateEnquiry,
    deleteEnquiry
};
