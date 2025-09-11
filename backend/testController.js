const priceHistoryController = require('./controllers/home/priceHistoryController');
const { dbConnect } = require('./utiles/db');

async function testController() {
    try {
        await dbConnect();
        console.log('✅ Database connected');

        // Mock request and response
        const mockReq = {
            params: { productId: '68c142f6eefa98f8e04df903' },
            query: { period: '1M' }
        };

        const mockRes = {
            status: (code) => ({
                json: (data) => {
                    console.log('Response status:', code);
                    console.log('Response data:', JSON.stringify(data, null, 2));
                }
            })
        };

        console.log('Testing priceHistoryController.get_price_history...');
        await priceHistoryController.get_price_history(mockReq, mockRes);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

testController();
