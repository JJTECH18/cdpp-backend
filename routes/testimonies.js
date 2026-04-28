const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const { authorize } = require('../middleware/auth');
const { getTestimonies, submitTestimony } = require('../controllers/content');

router.get('/', getTestimonies);
router.post('/', optionalAuth, submitTestimony);

module.exports = router;