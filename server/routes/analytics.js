const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics');

router.get('/', analyticsController.getStats);

module.exports = router;
