const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getDashboardStats, getAllMembers, approveMember, updateMemberRole, toggleMemberStatus, approveTestimony, deleteMember } = require('../controllers/admin');

router.use(protect, authorize('admin', 'super_admin'));
router.get('/dashboard', getDashboardStats);
router.get('/members', getAllMembers);
router.put('/members/:id/approve', approveMember);
router.put('/members/:id/role', updateMemberRole);
router.put('/members/:id/toggle-status', toggleMemberStatus);
router.put('/testimonies/:id/approve', approveTestimony);
router.delete('/members/:id', deleteMember);

module.exports = router;