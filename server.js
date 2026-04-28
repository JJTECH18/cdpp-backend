const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const dotenv   = require('dotenv');

dotenv.config();

const authRoutes       = require('./routes/auth');
const memberRoutes     = require('./routes/members');
const programRoutes    = require('./routes/programs');
const eventRoutes      = require('./routes/events');
const mediaRoutes      = require('./routes/media');
const testimonyRoutes  = require('./routes/testimonies');
const outreachRoutes   = require('./routes/outreaches');
const newsletterRoutes = require('./routes/newsletter');
const adminRoutes      = require('./routes/admin');

const app = express();

// ─── CORS ─────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// ─── SECURITY MIDDLEWARE ─────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// ─── DATABASE CONNECTION ─────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
      console.error('❌ MongoDB Error:', err.message);
      process.exit(1);
    });
}

// ─── ROUTES ──────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/members',     memberRoutes);
app.use('/api/programs',    programRoutes);
app.use('/api/events',      eventRoutes);
app.use('/api/media',       mediaRoutes);
app.use('/api/testimonies', testimonyRoutes);
app.use('/api/outreaches',  outreachRoutes);
app.use('/api/newsletter',  newsletterRoutes);
app.use('/api/admin',       adminRoutes);

// ─── ROOT ROUTE ──────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 CDPP API is running successfully',
    health: '/api/health'
  });
});

// ─── HEALTH CHECK ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🙏 CDPP API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// ─── 404 HANDLER ─────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// ─── ERROR HANDLER ───────────────────────────────────
app.use((err, req, res, next) => {
  console.error('🔴 Error:', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ─── START SERVER ────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 CDPP Server running on port ${PORT}`);
  console.log(`🌐 Health: /api/health`);
  console.log(`⚙️ Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;