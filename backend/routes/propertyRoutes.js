const express = require('express');
const { getProperties, getPropertyDiff, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const verifyAdmin = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getProperties);
router.get('/:id', getPropertyDiff);
router.post('/', verifyAdmin, createProperty);
router.put('/:id', verifyAdmin, updateProperty);
router.delete('/:id', verifyAdmin, deleteProperty);

module.exports = router;
