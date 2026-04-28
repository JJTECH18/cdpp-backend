const { Media, Event, Program, Testimony, Outreach, Subscriber } = require('../models/index');

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ isPublished: true }).sort('date');
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) { next(err); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: event });
  } catch (err) { next(err); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: event });
  } catch (err) { next(err); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Event deleted.' });
  } catch (err) { next(err); }
};

exports.getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find({ isActive: true }).sort('order');
    res.status(200).json({ success: true, data: programs });
  } catch (err) { next(err); }
};

exports.createProgram = async (req, res, next) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({ success: true, data: program });
  } catch (err) { next(err); }
};

exports.updateProgram = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: program });
  } catch (err) { next(err); }
};

exports.getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find({ isPublished: true }).sort('-createdAt');
    res.status(200).json({ success: true, count: media.length, data: media });
  } catch (err) { next(err); }
};

exports.uploadMedia = async (req, res, next) => {
  try {
    const media = await Media.create({ ...req.body, uploadedBy: req.user.id });
    res.status(201).json({ success: true, data: media });
  } catch (err) { next(err); }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Media deleted.' });
  } catch (err) { next(err); }
};

exports.getTestimonies = async (req, res, next) => {
  try {
    const testimonies = await Testimony.find({ isApproved: true }).sort('-createdAt');
    res.status(200).json({ success: true, data: testimonies });
  } catch (err) { next(err); }
};

exports.submitTestimony = async (req, res, next) => {
  try {
    const testimony = await Testimony.create({
      ...req.body,
      author: req.user ? req.user.id : undefined,
      authorName: req.user ? `${req.user.firstName} ${req.user.lastName}` : req.body.authorName
    });
    res.status(201).json({ success: true, message: 'Testimony submitted! Awaiting approval. 🙏' });
  } catch (err) { next(err); }
};

exports.getOutreaches = async (req, res, next) => {
  try {
    const outreaches = await Outreach.find({ isPublished: true }).sort('-date');
    res.status(200).json({ success: true, data: outreaches });
  } catch (err) { next(err); }
};

exports.createOutreach = async (req, res, next) => {
  try {
    const outreach = await Outreach.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ success: true, data: outreach });
  } catch (err) { next(err); }
};

exports.subscribe = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const existing = await Subscriber.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Already subscribed!' });
    await Subscriber.create({ email, name });
    res.status(201).json({ success: true, message: 'Subscribed successfully! 🙏' });
  } catch (err) { next(err); }
};

exports.getMembersDirectory = async (req, res, next) => {
  try {
    const members = await require('../models/Member').find({ isActive: true, isApproved: true })
      .select('firstName lastName avatar role department memberSince bio').sort('firstName');
    res.status(200).json({ success: true, data: members });
  } catch (err) { next(err); }
};