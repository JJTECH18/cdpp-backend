const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const MemberSchema = new mongoose.Schema({
  firstName:  { type: String, required: true, trim: true },
  lastName:   { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  phone:      { type: String },
  password:   { type: String, required: true, minlength: 8, select: false },
  role:       { type: String, enum: ['member','admin','super_admin'], default: 'member' },
  department: { type: String, default: 'none' },
  avatar:     { public_id: String, url: { type: String, default: '' } },
  bio:        { type: String },
  isActive:        { type: Boolean, default: true },
  isApproved:      { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  memberSince:     { type: Date, default: Date.now },
  lastLogin:       { type: Date },
  passwordResetToken:  String,
  passwordResetExpire: Date,
  emailVerifyToken:    String,
  emailVerifyExpire:   Date,
}, { timestamps: true });

MemberSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

MemberSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

MemberSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

MemberSchema.methods.getSignedJWT = function() {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

MemberSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

MemberSchema.methods.getEmailVerifyToken = function() {
  const token = crypto.randomBytes(20).toString('hex');
  this.emailVerifyToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

module.exports = mongoose.model('Member', MemberSchema);