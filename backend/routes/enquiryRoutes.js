const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry } = require('../controllers/enquiryController');
const verifyAdmin = require('../middleware/authMiddleware');

router.post('/', createEnquiry);
router.get('/', verifyAdmin, getEnquiries);
router.put('/:id', verifyAdmin, updateEnquiry);
router.delete('/:id', verifyAdmin, deleteEnquiry);

module.exports = router;
