const express = require('express');
const { createBooking, getBookings } = require('../controllers/bookingController');
const verifyAdmin = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', createBooking);
router.get('/', verifyAdmin, getBookings);

module.exports = router;
