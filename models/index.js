const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  date:        { type: Date, required: true },
  time:        { type: String },
  location:    { type: String },
  category:    { type: String, default: 'other' },
  isPublished: { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

const ProgramSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  icon:        { type: String, default: '🙏' },
  schedule:    { type: String },
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 }
}, { timestamps: true });

const MediaSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  type:        { type: String, enum: ['audio','video','document','image'], required: true },
  category:    { type: String, default: 'sermon' },
  file:        { public_id: String, url: String },
  speaker:     { type: String },
  views:       { type: Number, default: 0 },
  downloads:   { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  uploadedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

const TestimonySchema = new mongoose.Schema({
  authorName:  { type: String, required: true },
  title:       { type: String, required: true },
  content:     { type: String, required: true },
  category:    { type: String, default: 'other' },
  isApproved:  { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

const OutreachSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String },
  location:    { type: String },
  date:        { type: Date },
  category:    { type: String },
  isPublished: { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }
}, { timestamps: true });

const SubscriberSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true, lowercase: true },
  name:       { type: String },
  isActive:   { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = {
  Event:      mongoose.model('Event', EventSchema),
  Program:    mongoose.model('Program', ProgramSchema),
  Media:      mongoose.model('Media', MediaSchema),
  Testimony:  mongoose.model('Testimony', TestimonySchema),
  Outreach:   mongoose.model('Outreach', OutreachSchema),
  Subscriber: mongoose.model('Subscriber', SubscriberSchema)
};