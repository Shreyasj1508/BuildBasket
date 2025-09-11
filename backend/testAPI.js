const { dbConnect } = require('./utiles/db');
const priceHistoryModel = require('./models/priceHistoryModel');
const productModel = require('./models/productModel');

async function testAPI() {
    try {
        await dbConnect();
        console.log('✅ Database connected');

        // Get first product
        const product = await productModel.findOne({});
        if (!product) {
            console.log('❌ No products found');
            return;
        }

        console.log('📦 Testing with product:', product.name, '(ID:', product._id + ')');

        // Check price history
        const priceHistory = await priceHistoryModel.findOne({ productId: product._id });
        if (!priceHistory) {
            console.log('❌ No price history found for this product');
            return;
        }

        console.log('✅ Price history found:', {
            currentPrice: priceHistory.currentPrice,
            historyCount: priceHistory.priceHistory.length,
            marketTrend: priceHistory.marketTrend
        });

        // Test API endpoint
        const response = await fetch(`http://localhost:5000/api/home/price-history/${product._id}?period=1M`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', {
                success: data.success,
                message: data.message,
                hasPriceHistory: !!data.priceHistory,
                historyLength: data.priceHistory?.priceHistory?.length || 0
            });
        } else {
            console.log('❌ API Error:', response.status, response.statusText);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
}

// Wait a bit for server to start, then test
setTimeout(testAPI, 3000);
