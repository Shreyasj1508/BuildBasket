const sellerVerificationController = require('../../controllers/admin/sellerVerificationController');
const router = require('express').Router();

// Get all pending sellers for verification
router.get('/pending-sellers', sellerVerificationController.getPendingSellers);

// Verify a specific seller (approve or reject)
router.put('/verify-seller/:sellerId', sellerVerificationController.verifySeller);

// Get verification statistics
router.get('/verification-stats', sellerVerificationController.getVerificationStats);

// Bulk verify sellers
router.put('/bulk-verify', sellerVerificationController.bulkVerifySellers);

// Get verification history
router.get('/verification-history', sellerVerificationController.getVerificationHistory);

module.exports = router;
