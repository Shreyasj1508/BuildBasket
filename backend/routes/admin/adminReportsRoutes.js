const express = require('express');
const router = express.Router();
const adminReportsController = require('../../controllers/admin/adminReportsController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// Reports & Exports Routes
router.post('/export', authMiddleware, adminReportsController.export_seller_report);
router.post('/export', authMiddleware, adminReportsController.export_buyer_report);
router.post('/export', authMiddleware, adminReportsController.export_transaction_report);
router.post('/export', authMiddleware, adminReportsController.export_credit_report);
router.post('/setup-email', authMiddleware, adminReportsController.setup_email_reports);

module.exports = router;
