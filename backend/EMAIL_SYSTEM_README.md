# Email Notification System - BuildBasket

## Overview
The BuildBasket platform now includes a comprehensive email notification system that automatically sends emails to customers, sellers, and administrators for various registration and verification events.

## Features Implemented

### ✅ Customer Registration Notifications
- **Welcome Email**: New customers receive a beautiful welcome email with orange theme
- **Admin Notification**: Administrators are notified when new customers register
- **Automatic Trigger**: Emails are sent automatically during customer registration

### ✅ Seller Registration & Verification System
- **Admin Verification Required**: New sellers require admin approval before listings go live
- **Pending Status**: Sellers start with 'pending' status
- **Admin Notifications**: Administrators receive notifications for new seller registrations
- **Verification Emails**: Sellers receive status updates (approved/rejected)

### ✅ Email Templates
- **Beautiful HTML Templates**: Professional email designs with orange theme
- **Responsive Design**: Emails work on all devices
- **Brand Consistency**: Matches BuildBasket's orange color scheme

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install nodemailer
```

### 2. Configure Environment Variables
Add these variables to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@buildbasket.com

# Frontend URLs
FRONTEND_URL=http://localhost:3000
DASHBOARD_URL=http://localhost:3000/admin/dashboard
```

### 3. Gmail Setup (Recommended)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password as `EMAIL_PASS`

### 4. Test Email Configuration
```bash
# Test email configuration
GET /api/admin/email/test-config

# Send test email
POST /api/admin/email/test-email
{
  "email": "test@example.com",
  "type": "customer-welcome"
}
```

## API Endpoints

### Email Test Endpoints
- `GET /api/admin/email/test-config` - Test email configuration
- `POST /api/admin/email/test-email` - Send test email

### Seller Verification Endpoints
- `GET /api/admin/pending-sellers` - Get all pending sellers
- `PUT /api/admin/verify-seller/:sellerId` - Verify a seller
- `GET /api/admin/verification-stats` - Get verification statistics
- `PUT /api/admin/bulk-verify` - Bulk verify sellers
- `GET /api/admin/verification-history` - Get verification history

## Email Types

### 1. Customer Welcome Email
- **Trigger**: New customer registration
- **Recipient**: Customer
- **Content**: Welcome message, account details, shopping link

### 2. Admin Customer Notification
- **Trigger**: New customer registration
- **Recipient**: Admin
- **Content**: Customer details, dashboard link

### 3. Admin Seller Notification
- **Trigger**: New seller registration
- **Recipient**: Admin
- **Content**: Seller details, verification required alert

### 4. Seller Verification Email
- **Trigger**: Seller status change (approved/rejected)
- **Recipient**: Seller
- **Content**: Status update, next steps

## Database Changes

### Seller Model Updates
Added new fields to seller schema:
```javascript
{
  verificationReason: String,
  verifiedAt: Date,
  verifiedBy: String
}
```

## Workflow

### Customer Registration Flow
1. Customer registers → Account created
2. Welcome email sent to customer
3. Notification email sent to admin
4. Customer can start shopping immediately

### Seller Registration Flow
1. Seller registers → Account created with 'pending' status
2. Notification email sent to admin
3. Admin reviews seller application
4. Admin approves/rejects seller
5. Verification email sent to seller
6. If approved, seller can start listing products

## Testing

### Test Email Configuration
```bash
curl -X GET http://localhost:5000/api/admin/email/test-config
```

### Send Test Email
```bash
curl -X POST http://localhost:5000/api/admin/email/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "type": "customer-welcome"
  }'
```

## Error Handling
- Email failures don't break registration process
- Errors are logged to console
- Graceful fallback if email service is unavailable

## Security Notes
- Use App Passwords for Gmail (not regular passwords)
- Store email credentials in environment variables
- Consider using professional email services for production

## Production Recommendations
- Use SendGrid, Mailgun, or AWS SES for production
- Implement email queuing for high volume
- Add email templates management system
- Monitor email delivery rates

## Troubleshooting

### Common Issues
1. **Authentication Failed**: Check EMAIL_USER and EMAIL_PASS
2. **Connection Timeout**: Check internet connection and firewall
3. **Emails Not Sending**: Verify Gmail App Password setup

### Debug Steps
1. Check email configuration: `GET /api/admin/email/test-config`
2. Test with simple email: `POST /api/admin/email/test-email`
3. Check server logs for error messages
4. Verify environment variables are loaded

## Support
For issues or questions about the email system, check:
1. Server console logs
2. Email service configuration
3. Environment variables
4. Network connectivity
