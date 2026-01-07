const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id }, process.env.JWT, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({ message: "Login successful", username: admin.username });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out" });
};

const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ isAuthenticated: false });

        const decoded = jwt.verify(token, process.env.JWT);
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) return res.json({ isAuthenticated: false });

        res.json({ isAuthenticated: true, user: admin });
    } catch (err) {
        res.json({ isAuthenticated: false });
    }
};

module.exports = { login, logout, checkAuth };
