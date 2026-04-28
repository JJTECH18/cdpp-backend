const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMembersDirectory } = require('../controllers/content');
const mongoose = require('mongoose');

// SIMPLE Member model (temporary for now)
const Member = mongoose.models.Member || mongoose.model('Member', new mongoose.Schema({
  name: String,
  email: String,
  phone: String
}, { timestamps: true }));

// 🔥 TEST route (this fixes your main issue)
router.get('/', (req, res) => {
  res.json({ message: "Members route working" });
});

// 🔥 GET all members from DB
router.get('/all', async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔥 POST new member
router.post('/add', async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Your original protected route (UNCHANGED)
router.get('/directory', protect, getMembersDirectory);

module.exports = router;