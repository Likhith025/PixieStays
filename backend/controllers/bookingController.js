const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        // TODO: Send email notification
        res.status(201).json(newBooking);
    } catch (err) {
        res.status(400).json({ message: "Error creating booking", error: err.message });
    }
};

const getBookings = async (req, res) => {
    try {
        const filter = {};
        if (req.query.propertyId) {
            filter.propertyId = req.query.propertyId;
        }

        const bookings = await Booking.find(filter)
            .populate('propertyId', 'title')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching bookings" });
    }
};

module.exports = { createBooking, getBookings };
