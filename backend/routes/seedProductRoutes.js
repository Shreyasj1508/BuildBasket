const express = require('express');
const router = express.Router();
const { seedDatabase } = require('../seeders/productSeeder');
const { responseReturn } = require('../utiles/response');

// Route to seed the database with sample data
router.post('/seed-products', async (req, res) => {
    try {
        await seedDatabase();
        responseReturn(res, 200, {
            message: 'Database seeded successfully with sample products',
            success: true
        });
    } catch (error) {
        console.error('Seeding error:', error);
        responseReturn(res, 500, {
            message: 'Failed to seed database',
            error: error.message
        });
    }
});

module.exports = router;
