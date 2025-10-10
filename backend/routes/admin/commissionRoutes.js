const commissionController = require('../../controllers/admin/commissionController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { adminMiddleware } = require('../../middlewares/adminMiddleware');
const router = require('express').Router();

// Admin-only commission routes
router.get('/get-config', authMiddleware, adminMiddleware, commissionController.get_commission_config);
router.post('/update-config', authMiddleware, adminMiddleware, commissionController.update_commission_config);
router.get('/history', authMiddleware, adminMiddleware, commissionController.get_commission_history);
router.post('/update-all', authMiddleware, adminMiddleware, commissionController.update_all_products_commission);
router.post('/update-product', authMiddleware, adminMiddleware, commissionController.update_product_commission);

module.exports = router;

