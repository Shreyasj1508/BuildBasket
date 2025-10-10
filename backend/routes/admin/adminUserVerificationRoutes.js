const express = require('express');
const router = express.Router();
const adminUserVerificationController = require('../../controllers/admin/adminUserVerificationController');
const { authMiddleware } = require('../../middlewares/authMiddleware');

// User Verification Routes
router.get('/sellers', authMiddleware, adminUserVerificationController.get_all_sellers);
router.get('/buyers', authMiddleware, adminUserVerificationController.get_all_buyers);
router.post('/seller/verify', authMiddleware, adminUserVerificationController.verify_seller);
router.post('/buyer/verify', authMiddleware, adminUserVerificationController.verify_buyer);
router.post('/buyer/add', authMiddleware, adminUserVerificationController.add_buyer);
router.post('/buyer/update-credit', authMiddleware, adminUserVerificationController.update_buyer_credit);

module.exports = router;
