const crypto = require('crypto');
const Member = require('../models/Member');

const sendTokenResponse = (member, statusCode, res, message = 'Success') => {
  const token = member.getSignedJWT();
  res.status(statusCode).json({
    success: true, message, token,
    data: {
      id: member._id, firstName: member.firstName,
      lastName: member.lastName, email: member.email,
      role: member.role, isApproved: member.isApproved
    }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const existing = await Member.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });
    const member = await Member.create({ firstName, lastName, email, password, phone, isEmailVerified: true });
    res.status(201).json({ success: true, message: 'Registration successful! Awaiting admin approval.' });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    const member = await Member.findOne({ email }).select('+password');
    if (!member) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    const isMatch = await member.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    if (!member.isApproved) return res.status(401).json({ success: false, message: 'Your account is pending admin approval.' });
    if (!member.isActive) return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' });
    member.lastLogin = Date.now();
    await member.save({ validateBeforeSave: false });
    sendTokenResponse(member, 200, res, 'Welcome back! 🙏');
  } catch (err) { next(err); }
};

exports.getMe = async (req, res) => {
  const member = await Member.findById(req.user.id);
  res.status(200).json({ success: true, data: member });
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const member = await Member.findOne({ email: req.body.email });
    if (!member) return res.status(404).json({ success: false, message: 'No account with that email.' });
    const resetToken = member.getResetPasswordToken();
    await member.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: 'Reset token generated.', resetToken });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const member = await Member.findOne({ passwordResetToken: hashed, passwordResetExpire: { $gt: Date.now() } });
    if (!member) return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    member.password = req.body.password;
    member.passwordResetToken = undefined;
    member.passwordResetExpire = undefined;
    await member.save();
    sendTokenResponse(member, 200, res, 'Password reset successful!');
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const fields = ['firstName','lastName','phone','bio'];
    const updates = {};
    fields.forEach(f => { if (req.body[f]) updates[f] = req.body[f]; });
    const member = await Member.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.status(200).json({ success: true, data: member });
  } catch (err) { next(err); }
};

exports.changePassword = async (req, res, next) => {
  try {
    const member = await Member.findById(req.user.id).select('+password');
    if (!await member.matchPassword(req.body.currentPassword)) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
    }
    member.password = req.body.newPassword;
    await member.save();
    sendTokenResponse(member, 200, res, 'Password changed!');
  } catch (err) { next(err); }
};