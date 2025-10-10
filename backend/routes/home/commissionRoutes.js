const commissionController = require('../../controllers/home/commissionController');
const router = require('express').Router();

// Get current commission configuration
router.get('/get-commission', commissionController.get_commission);

// Calculate commission for a specific price
router.post('/calculate-commission', commissionController.calculate_commission);
router.get('/calculate-commission', commissionController.calculate_commission);

module.exports = router;

