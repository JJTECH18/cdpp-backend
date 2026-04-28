const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/content');

router.get('/', getEvents);
router.post('/', protect, authorize('admin','super_admin'), createEvent);
router.put('/:id', protect, authorize('admin','super_admin'), updateEvent);
router.delete('/:id', protect, authorize('admin','super_admin'), deleteEvent);

module.exports = router;