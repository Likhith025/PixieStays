const express = require('express');
const router = express.Router();
const { getLinks, createLink, updateLink, deleteLink } = require('../controllers/linkController');
const verifyAdmin = require('../middleware/authMiddleware');

router.get('/', getLinks);
router.post('/', verifyAdmin, createLink);
router.put('/:id', verifyAdmin, updateLink);
router.delete('/:id', verifyAdmin, deleteLink);

module.exports = router;
