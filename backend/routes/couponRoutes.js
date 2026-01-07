const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, couponController.createCoupon);
router.get('/', protect, admin, couponController.getCoupons);
router.put('/:id', protect, admin, couponController.updateCoupon);
router.delete('/:id', protect, admin, couponController.deleteCoupon);
router.post('/verify', couponController.verifyCoupon); // Public access for users

module.exports = router;
