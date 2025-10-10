const express = require('express');
const router = express.Router();
const adminAnalyticsController = require('../../controllers/admin/adminAnalyticsController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Analytics Dashboard Routes
router.get('/', authMiddleware, adminAnalyticsController.get_analytics);
router.post('/export', authMiddleware, adminAnalyticsController.export_analytics);

module.exports = router;