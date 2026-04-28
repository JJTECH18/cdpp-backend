const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getOutreaches, createOutreach } = require('../controllers/content');

router.get('/', getOutreaches);
router.post('/', protect, authorize('admin','super_admin'), createOutreach);

module.exports = router;