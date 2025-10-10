const express = require('express');
const router = express.Router();
const adminActivitiesController = require('../../controllers/admin/adminActivitiesController');
const { adminMiddleware } = require('../../middlewares/adminMiddleware');

// Admin activities routes
router.get('/activities', adminMiddleware, adminActivitiesController.getRecentActivities);
router.get('/dashboard', adminMiddleware, adminActivitiesController.getDashboardOverview);

module.exports = router;
