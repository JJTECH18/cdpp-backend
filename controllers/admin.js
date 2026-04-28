const Member = require('../models/Member');
const { Testimony, Media, Event } = require('../models/index');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalMembers, pendingMembers, activeMembers, totalMedia, upcomingEvents, pendingTestimonies] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ isApproved: false }),
      Member.countDocuments({ isActive: true, isApproved: true }),
      Media.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date() } }),
      Testimony.countDocuments({ isApproved: false })
    ]);
    res.status(200).json({ success: true, data: { totalMembers, pendingMembers, activeMembers, totalMedia, upcomingEvents, pendingTestimonies } });
  } catch (err) { next(err); }
};

exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, count: members.length, data: members });
  } catch (err) { next(err); }
};

exports.approveMember = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    res.status(200).json({ success: true, message: `${member.firstName} approved!`, data: member });
  } catch (err) { next(err); }
};

exports.updateMemberRole = async (req, res, next) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, { role: req.body.role, department: req.body.department }, { new: true });
    res.status(200).json({ success: true, data: member });
  } catch (err) { next(err); }
};

exports.toggleMemberStatus = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found.' });
    member.isActive = !member.isActive;
    await member.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: `Member ${member.isActive ? 'activated' : 'deactivated'}.` });
  } catch (err) { next(err); }
};

exports.approveTestimony = async (req, res, next) => {
  try {
    const testimony = await Testimony.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.status(200).json({ success: true, data: testimony });
  } catch (err) { next(err); }
};

exports.deleteMember = async (req, res, next) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Member deleted.' });
  } catch (err) { next(err); }
};