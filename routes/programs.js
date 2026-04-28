const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getPrograms, createProgram, updateProgram } = require('../controllers/content');

router.get('/', getPrograms);
router.post('/', protect, authorize('admin','super_admin'), createProgram);
router.put('/:id', protect, authorize('admin','super_admin'), updateProgram);

module.exports = router;