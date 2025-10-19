const emailService = require('../../utiles/emailService');
const { responseReturn } = require('../../utiles/response');

class emailTestController {
    
    testEmailConfig = async (req, res) => {
        try {
            const isValid = await emailService.testEmailConfiguration();
            
            if (isValid) {
                responseReturn(res, 200, {
                    success: true,
                    message: 'Email configuration is valid and working'
                });
            } else {
                responseReturn(res, 500, {
                    success: false,
                    message: 'Email configuration is invalid'
                });
            }
        } catch (error) {
            console.error('Email test error:', error);
            responseReturn(res, 500, {
                success: false,
                message: 'Email test failed',
                error: error.message
            });
        }
    };

    sendTestEmail = async (req, res) => {
        try {
            const { email, type } = req.body;
            
            if (!email) {
                return responseReturn(res, 400, { error: 'Email is required' });
            }

            let result = false;
            
            switch (type) {
                case 'customer-welcome':
                    result = await emailService.sendCustomerWelcomeEmail({
                        name: 'Test Customer',
                        email: email
                    });
                    break;
                    
                case 'admin-customer-notification':
                    result = await emailService.sendAdminCustomerNotification({
                        name: 'Test Customer',
                        email: email
                    });
                    break;
                    
                case 'admin-seller-notification':
                    result = await emailService.sendAdminSellerNotification({
                        name: 'Test Seller',
                        email: email
                    });
                    break;
                    
                case 'seller-verification':
                    result = await emailService.sendSellerVerificationEmail({
                        name: 'Test Seller',
                        email: email
                    }, 'active');
                    break;
                    
                default:
                    return responseReturn(res, 400, { 
                        error: 'Invalid email type. Use: customer-welcome, admin-customer-notification, admin-seller-notification, seller-verification' 
                    });
            }

            if (result) {
                responseReturn(res, 200, {
                    success: true,
                    message: `Test ${type} email sent successfully to ${email}`
                });
            } else {
                responseReturn(res, 500, {
                    success: false,
                    message: `Failed to send test ${type} email`
                });
            }
        } catch (error) {
            console.error('Test email error:', error);
            responseReturn(res, 500, {
                success: false,
                message: 'Test email failed',
                error: error.message
            });
        }
    };
}

module.exports = new emailTestController();
