const express = require('express');
const { getAllContent, updateContent } = require('../controllers/contentController');
const verifyAdmin = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllContent);
router.post('/', verifyAdmin, updateContent); // Use POST for upsert

module.exports = router;
