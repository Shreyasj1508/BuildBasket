const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excel/excelController');

// Excel import routes
router.post('/import/categories', excelController.uploadExcel, excelController.importCategories);
router.post('/import/products', excelController.uploadExcel, excelController.importProducts);
router.post('/import/sellers', excelController.uploadExcel, excelController.importSellers);
router.post('/import/customers', excelController.uploadExcel, excelController.importCustomers);
router.post('/import/banners', excelController.uploadExcel, excelController.importBanners);

// Get sample templates
router.get('/templates', excelController.getSampleTemplates);

module.exports = router;
