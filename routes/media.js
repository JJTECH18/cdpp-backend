const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllMedia, uploadMedia, deleteMedia } = require('../controllers/content');

router.get('/', getAllMedia);
router.post('/', protect, authorize('admin','super_admin'), uploadMedia);
router.delete('/:id', protect, authorize('admin','super_admin'), deleteMedia);

module.exports = router;