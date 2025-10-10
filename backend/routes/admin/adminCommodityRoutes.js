const express = require('express');
const router = express.Router();
const adminCommodityController = require('../../controllers/admin/adminCommodityController');
const { authMiddleware } = require('../../middlewares/authMiddleware');
const { uploadExcel } = require('../../middlewares/uploadMiddleware');

// Commodity Management Routes
router.get('/get-all', authMiddleware, adminCommodityController.get_all_commodities);
router.post('/upload-excel', authMiddleware, uploadExcel, adminCommodityController.upload_excel_commodities);
router.post('/add', authMiddleware, adminCommodityController.add_commodity);
router.put('/update/:id', authMiddleware, adminCommodityController.update_commodity);
router.delete('/delete/:id', authMiddleware, adminCommodityController.delete_commodity);

module.exports = router;
