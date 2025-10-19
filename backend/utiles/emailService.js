const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
    }

    async sendCustomerWelcomeEmail(customerData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: customerData.email,
                subject: 'Welcome to BuildBasket! 🎉',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #ff8c42, #ff6b35);">
                        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #ff6b35; font-size: 28px; margin: 0;">Welcome to BuildBasket!</h1>
                                <p style="color: #666; font-size: 16px; margin: 10px 0;">Your account has been successfully created</p>
                            </div>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                                <h3 style="color: #333; margin-top: 0;">Account Details:</h3>
                                <p><strong>Name:</strong> ${customerData.name}</p>
                                <p><strong>Email:</strong> ${customerData.email}</p>
                                <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                                   style="background: linear-gradient(135deg, #ff8c42, #ff6b35); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                                    Start Shopping Now
                                </a>
                            </div>
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                                <p>Thank you for choosing BuildBasket!</p>
                                <p>If you have any questions, feel free to contact our support team.</p>
                            </div>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Customer welcome email sent successfully to:', customerData.email);
            return true;
        } catch (error) {
            console.error('Error sending customer welcome email:', error);
            return false;
        }
    }

    async sendAdminCustomerNotification(customerData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: process.env.ADMIN_EMAIL || 'admin@buildbasket.com',
                subject: 'New Customer Registration - BuildBasket',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-left: 5px solid #ff6b35;">
                            <h2 style="color: #ff6b35; margin-top: 0;">New Customer Registration</h2>
                            <p>A new customer has registered on BuildBasket platform.</p>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                <h3 style="color: #333; margin-top: 0;">Customer Details:</h3>
                                <p><strong>Name:</strong> ${customerData.name}</p>
                                <p><strong>Email:</strong> ${customerData.email}</p>
                                <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                                <p><strong>Registration Time:</strong> ${new Date().toLocaleTimeString()}</p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.DASHBOARD_URL || 'http://localhost:3000/admin/dashboard'}" 
                                   style="background: #ff6b35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    View Dashboard
                                </a>
                            </div>
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                                <p>This is an automated notification from BuildBasket Admin System.</p>
                            </div>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Admin notification email sent successfully for customer:', customerData.email);
            return true;
        } catch (error) {
            console.error('Error sending admin notification email:', error);
            return false;
        }
    }

    async sendAdminSellerNotification(sellerData) {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: process.env.ADMIN_EMAIL || 'admin@buildbasket.com',
                subject: 'New Seller Registration - Verification Required',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border-left: 5px solid #ff6b35;">
                            <h2 style="color: #ff6b35; margin-top: 0;">New Seller Registration</h2>
                            <p>A new seller has registered and requires admin verification to start selling.</p>
                            
                            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #ffc107;">
                                <h3 style="color: #856404; margin-top: 0;">⚠️ Action Required</h3>
                                <p style="color: #856404; margin: 0;">This seller needs admin verification before their listings can go live.</p>
                            </div>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                                <h3 style="color: #333; margin-top: 0;">Seller Details:</h3>
                                <p><strong>Name:</strong> ${sellerData.name}</p>
                                <p><strong>Email:</strong> ${sellerData.email}</p>
                                <p><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
                                <p><strong>Status:</strong> <span style="color: #ff6b35; font-weight: bold;">Pending Verification</span></p>
                            </div>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.DASHBOARD_URL || 'http://localhost:3000/admin/dashboard/sellers-request'}" 
                                   style="background: #ff6b35; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                    Verify Seller
                                </a>
                            </div>
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                                <p>This is an automated notification from BuildBasket Admin System.</p>
                            </div>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Admin notification email sent successfully for seller:', sellerData.email);
            return true;
        } catch (error) {
            console.error('Error sending admin seller notification email:', error);
            return false;
        }
    }

    async sendSellerVerificationEmail(sellerData, status) {
        try {
            const isApproved = status === 'active';
            const subject = isApproved ? 'Seller Account Approved - BuildBasket' : 'Seller Account Verification Update - BuildBasket';
            
            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: sellerData.email,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: ${isApproved ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #dc3545, #fd7e14)'};">
                        <div style="background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: ${isApproved ? '#28a745' : '#dc3545'}; font-size: 28px; margin: 0;">
                                    ${isApproved ? '🎉 Account Approved!' : '⚠️ Verification Update'}
                                </h1>
                                <p style="color: #666; font-size: 16px; margin: 10px 0;">
                                    ${isApproved ? 'Your seller account has been verified and approved' : 'Your seller account verification status has been updated'}
                                </p>
                            </div>
                            
                            <div style="background: ${isApproved ? '#d4edda' : '#f8d7da'}; padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid ${isApproved ? '#28a745' : '#dc3545'};">
                                <h3 style="color: ${isApproved ? '#155724' : '#721c24'}; margin-top: 0;">Account Status:</h3>
                                <p style="color: ${isApproved ? '#155724' : '#721c24'}; margin: 0; font-weight: bold; font-size: 18px;">
                                    ${isApproved ? '✅ ACTIVE - Ready to Sell!' : '❌ ' + status.toUpperCase()}
                                </p>
                            </div>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                                <h3 style="color: #333; margin-top: 0;">Account Details:</h3>
                                <p><strong>Name:</strong> ${sellerData.name}</p>
                                <p><strong>Email:</strong> ${sellerData.email}</p>
                                <p><strong>Status:</strong> <span style="color: ${isApproved ? '#28a745' : '#dc3545'}; font-weight: bold;">${status}</span></p>
                                <p><strong>Updated Date:</strong> ${new Date().toLocaleDateString()}</p>
                            </div>
                            
                            ${isApproved ? `
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${process.env.DASHBOARD_URL || 'http://localhost:3000/seller/dashboard'}" 
                                   style="background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                                    Access Seller Dashboard
                                </a>
                            </div>
                            ` : ''}
                            
                            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                                <p>Thank you for choosing BuildBasket!</p>
                                <p>If you have any questions, feel free to contact our support team.</p>
                            </div>
                        </div>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Seller verification email sent successfully to: ${sellerData.email} (Status: ${status})`);
            return true;
        } catch (error) {
            console.error('Error sending seller verification email:', error);
            return false;
        }
    }

    async testEmailConfiguration() {
        try {
            await this.transporter.verify();
            console.log('Email configuration is valid');
            return true;
        } catch (error) {
            console.error('Email configuration error:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
