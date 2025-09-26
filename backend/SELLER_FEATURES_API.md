# Seller Features API Documentation

## Overview
This document describes all the seller features implemented in the AlmaMate e-commerce platform, based on the requirements from the seller features specification.

## Base URL
```
/api/seller
```

## Authentication
All endpoints require seller authentication using the `isSeller` middleware. Include the `accessToken` cookie in requests.

---

## 1. Region Management

### Get Seller Regions
**GET** `/regions`

Returns the seller's selected regions and their associated fares.

**Response:**
```json
{
  "success": true,
  "regions": ["North India", "South India"],
  "regionFares": {
    "North India": 50,
    "South India": 75
  }
}
```

### Add Seller Region
**POST** `/regions`

Add a new region to the seller's service area.

**Request Body:**
```json
{
  "region": "East India"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Region added successfully",
  "regions": ["North India", "South India", "East India"]
}
```

### Remove Seller Region
**DELETE** `/regions/:region`

Remove a region from the seller's service area.

**Response:**
```json
{
  "success": true,
  "message": "Region removed successfully",
  "regions": ["North India", "South India"]
}
```

### Update Region Fare
**PUT** `/regions/:region/fare`

Set or update the fixed fare for a specific region.

**Request Body:**
```json
{
  "fare": 100
}
```

**Response:**
```json
{
  "success": true,
  "message": "Fare updated successfully",
  "regionFares": [
    {"region": "North India", "fare": 50},
    {"region": "South India", "fare": 100}
  ]
}
```

---

## 2. GST Management

### Update GST Rate
**PUT** `/gst-rate`

Update the GST rate for the seller (auto-calculated on orders).

**Request Body:**
```json
{
  "gstRate": 18
}
```

**Response:**
```json
{
  "success": true,
  "message": "GST rate updated successfully",
  "gstRate": 18
}
```

---

## 3. Wallet Integration

### Get Seller Wallet
**GET** `/wallet`

Get the seller's wallet balance and payment information.

**Response:**
```json
{
  "success": true,
  "balance": 15000,
  "totalRevenue": 20000,
  "commission": 2000,
  "gst": 3600,
  "paymentMethod": "direct"
}
```

### Update Payment Method
**PUT** `/payment-method`

Update the seller's preferred payment method.

**Request Body:**
```json
{
  "paymentMethod": "sg_finserv"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method updated successfully",
  "paymentMethod": "sg_finserv"
}
```

**Payment Methods:**
- `direct`: Direct payment from customer
- `sg_finserv`: Payment via SG Finserv

---

## 4. Order Management

### Get Seller Orders
**GET** `/orders`

Get paginated list of seller's orders.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by delivery status

**Response:**
```json
{
  "success": true,
  "orders": [...],
  "totalOrders": 25,
  "currentPage": 1,
  "totalPages": 3
}
```

### Update Order Status
**PUT** `/orders/:orderId/status`

Update the delivery status of an order (visible to buyer).

**Request Body:**
```json
{
  "delivery_status": "shipped"
}
```

**Delivery Status Options:**
- `processing`: Order being prepared
- `shipped`: Order dispatched
- `delivered`: Order delivered

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {...}
}
```

### Upload Delivery Invoice
**POST** `/orders/:orderId/invoice`

Upload delivery invoice (visible to Admin only).

**Request Body:**
```json
{
  "invoiceUrl": "https://example.com/invoice.pdf"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery invoice uploaded successfully",
  "order": {...}
}
```

---

## 5. Analytics Dashboard

### Get Seller Analytics
**GET** `/analytics`

Get comprehensive analytics for the seller's performance.

**Response:**
```json
{
  "success": true,
  "analytics": {
    "topCommodities": [
      {
        "name": "Product A",
        "quantity": 150,
        "revenue": 15000
      }
    ],
    "topRegions": [
      {
        "name": "North India",
        "revenue": 25000
      }
    ],
    "revenueBreakdown": {
      "total": 50000,
      "commission": 5000,
      "gst": 9000,
      "profit": 45000
    },
    "salesPerformance": {
      "totalOrders": 100,
      "totalRevenue": 50000,
      "averageOrderValue": 500
    }
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Seller role required."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 409 Unauthorized
```json
{
  "error": "Please Login First"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Implementation Status

✅ **All Features Implemented:**

1. **Region Selection & Fixed Fare Management**
   - Add/remove regions
   - Set custom fares per region
   - Region-based pricing

2. **GST Auto-calculation**
   - Configurable GST rate (default 18%)
   - Automatic calculation on orders
   - Separate GST tracking

3. **Wallet Integration**
   - Sales value stored in seller wallet
   - Payment method selection (Direct/SG Finserv)
   - Commission and GST tracking

4. **Order Management**
   - Order status updates (visible to buyers)
   - Delivery invoice upload (admin-only visibility)
   - Order history and tracking

5. **Analytics Dashboard**
   - Sales performance metrics
   - Top-selling commodities
   - Regional performance analysis
   - Revenue breakdown with commission and GST

---

## Database Schema

### Seller Model (`sellerModel.js`)
```javascript
{
  regions: [String],           // Selected service regions
  regionFares: [{              // Fare for each region
    region: String,
    fare: Number
  }],
  gstRate: Number,             // GST percentage (default: 18)
  paymentMethod: String        // 'direct' or 'sg_finserv'
}
```

### Order Model (`authOrder.js`)
```javascript
{
  sellerId: ObjectId,          // Seller reference
  delivery_status: String,     // Order status
  delivery_invoice: String     // Invoice URL
}
```

---

## Frontend Integration Notes

The frontend should integrate with these endpoints to provide:

1. **Region Management UI**
   - Dropdown/checkbox for region selection
   - Fare input fields for each region
   - Region removal functionality

2. **Wallet Dashboard**
   - Balance display
   - Payment method toggle
   - Transaction history

3. **Order Management Interface**
   - Order list with status updates
   - File upload for invoices
   - Status change buttons

4. **Analytics Dashboard**
   - Charts for sales performance
   - Top commodities list
   - Regional revenue breakdown
   - Revenue analytics

---

## Testing

Run the test script to verify all features:
```bash
node test_seller_features.js
```

This will validate:
- Model schema completeness
- Controller method availability
- Route structure
- Database field requirements
