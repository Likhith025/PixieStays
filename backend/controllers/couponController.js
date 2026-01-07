const Coupon = require('../models/Coupon');

// Create a new coupon
exports.createCoupon = async (req, res) => {
    try {
        const coupon = new Coupon(req.body);
        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Get all coupons (Admin)
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update coupon
exports.updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete coupon
exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Verify/Apply Coupon (User)
exports.verifyCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true
        });

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
        }

        // check expiry
        const now = new Date();
        if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
            return res.status(400).json({ valid: false, message: 'Coupon has expired' });
        }

        // check min order
        if (orderAmount < coupon.minOrderValue) {
            return res.status(400).json({
                valid: false,
                message: `Minimum order of ₹${coupon.minOrderValue} required`
            });
        }

        // check usage limit
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ valid: false, message: 'Coupon usage limit exceeded' });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (orderAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        } else {
            discount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed order amount
        discount = Math.min(discount, orderAmount);

        res.json({
            valid: true,
            code: coupon.code,
            discount: Math.round(discount), // Round for cleanliness
            discountType: coupon.discountType,
            message: 'Coupon applied successfully'
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
