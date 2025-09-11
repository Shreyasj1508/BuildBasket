const { dbConnect } = require('../utiles/db');
const priceHistoryModel = require('../models/priceHistoryModel');
const productModel = require('../models/productModel');

// Generate realistic price history data
function generatePriceHistory(basePrice, days = 365) {
    const history = [];
    let currentPrice = basePrice;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Add some realistic price variation
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const change = currentPrice * variation;
        currentPrice = Math.max(currentPrice + change, basePrice * 0.7); // Don't go below 70% of base price
        currentPrice = Math.min(currentPrice, basePrice * 1.5); // Don't go above 150% of base price

        // Round to nearest 5
        currentPrice = Math.round(currentPrice / 5) * 5;

        const previousPrice = i > 0 ? history[i - 1].price : basePrice;
        const changeAmount = currentPrice - previousPrice;
        const changePercent = previousPrice > 0 ? (changeAmount / previousPrice) * 100 : 0;

        history.push({
            price: currentPrice,
            date: date,
            change: changeAmount,
            changePercent: parseFloat(changePercent.toFixed(2)),
            volume: Math.floor(Math.random() * 1000) + 100
        });
    }

    return history;
}

// Calculate metrics for price history
function calculateMetrics(history, currentPrice) {
    if (history.length === 0) return {};

    const prices = history.map(h => h.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Calculate changes
    const firstPrice = history[0].price;
    const lastPrice = history[history.length - 1].price;
    const totalChange = lastPrice - firstPrice;
    const totalChangePercent = firstPrice > 0 ? (totalChange / firstPrice) * 100 : 0;

    // Determine market trend
    let marketTrend = 'stable';
    if (totalChangePercent > 10) marketTrend = 'up';
    else if (totalChangePercent < -10) marketTrend = 'down';

    return {
        min,
        max,
        avg: parseFloat(avg.toFixed(2)),
        totalChange,
        totalChangePercent: parseFloat(totalChangePercent.toFixed(2)),
        marketTrend
    };
}

async function seedPriceHistory() {
    try {
        await dbConnect();
        console.log('✅ Database connected');

        // Get all products
        const products = await productModel.find({});
        console.log(`📦 Found ${products.length} products`);

        if (products.length === 0) {
            console.log('❌ No products found. Please seed products first.');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                // Check if price history already exists
                const existingHistory = await priceHistoryModel.findOne({ productId: product._id });
                if (existingHistory) {
                    console.log(`⏭️  Skipping ${product.name} - price history already exists`);
                    continue;
                }

                // Generate price history
                const priceHistory = generatePriceHistory(product.price, 365);
                const metrics = calculateMetrics(priceHistory, product.price);

                // Create price history document
                const priceHistoryDoc = new priceHistoryModel({
                    productId: product._id,
                    currentPrice: product.price,
                    priceHistory: priceHistory,
                    marketTrend: metrics.marketTrend,
                    lastUpdated: new Date(),
                    priceRange: {
                        min: metrics.min,
                        max: metrics.max,
                        avg: metrics.avg
                    },
                    weeklyChange: 0, // Will be calculated dynamically
                    monthlyChange: 0, // Will be calculated dynamically
                    quarterlyChange: 0, // Will be calculated dynamically
                    yearlyChange: metrics.totalChangePercent
                });

                await priceHistoryDoc.save();
                console.log(`✅ Created price history for ${product.name} (${priceHistory.length} days)`);
                successCount++;

            } catch (error) {
                console.error(`❌ Error creating price history for ${product.name}:`, error.message);
                errorCount++;
            }
        }

        console.log('\n🎉 Price History Seeding Complete!');
        console.log(`✅ Successfully created: ${successCount} price histories`);
        console.log(`❌ Errors: ${errorCount}`);

        // Verify the data
        const totalPriceHistories = await priceHistoryModel.countDocuments();
        console.log(`📊 Total price histories in database: ${totalPriceHistories}`);

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    } finally {
        process.exit(0);
    }
}

// Run the seeder
seedPriceHistory();