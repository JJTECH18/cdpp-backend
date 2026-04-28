const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/content');

router.post('/subscribe', subscribe);

module.exports = router;