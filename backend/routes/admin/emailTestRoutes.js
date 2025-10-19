const emailTestController = require('../../controllers/admin/emailTestController');
const router = require('express').Router();

// Test email configuration
router.get('/test-config', emailTestController.testEmailConfig);

// Send test email
router.post('/test-email', emailTestController.sendTestEmail);

module.exports = router;
