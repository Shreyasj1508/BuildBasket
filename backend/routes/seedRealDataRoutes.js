const express = require('express');
const router = express.Router();
const seedRealData = require('../seeders/seedRealData');
const { responseReturn } = require('../utiles/response');

// Seed real data endpoint (Admin only)
router.post('/seed-real-data', async (req, res) => {
    try {
        await seedRealData();
        responseReturn(res, 200, { 
            success: true,
            message: 'Real data seeded successfully!' 
        });
    } catch (error) {
        console.error('Error seeding real data:', error);
        responseReturn(res, 500, { 
            success: false,
            error: 'Failed to seed real data',
            details: error.message 
        });
    }
});

module.exports = router;
