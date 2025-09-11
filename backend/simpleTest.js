const fetch = require('node-fetch');

async function testAPI() {
    try {
        console.log('Testing API endpoint...');
        
        // Test if server is running
        const response = await fetch('http://localhost:5000/api/home/get-products');
        console.log('Products API status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Products API working, found', data.products?.length || 0, 'products');
            
            // Test price history API
            if (data.products && data.products.length > 0) {
                const productId = data.products[0]._id;
                console.log('Testing price history for product:', productId);
                
                const priceResponse = await fetch(`http://localhost:5000/api/home/price-history/${productId}?period=1M`);
                console.log('Price history API status:', priceResponse.status);
                
                if (priceResponse.ok) {
                    const priceData = await priceResponse.json();
                    console.log('✅ Price history API working:', priceData.message);
                } else {
                    const errorText = await priceResponse.text();
                    console.log('❌ Price history API error:', errorText);
                }
            }
        } else {
            console.log('❌ Server not responding');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testAPI();
