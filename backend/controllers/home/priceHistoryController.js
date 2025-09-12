const priceHistoryModel = require('../../models/priceHistoryModel');
const productModel = require('../../models/productModel');
const { responseReturn } = require("../../utiles/response");

class priceHistoryController {
    // Get price history for a specific product
    get_price_history = async (req, res) => {
        try {
            const { productId } = req.params;
            const { period = '1M' } = req.query; // 7D, 1M, 3M, 6M, 1Y
            
            let priceHistory = await priceHistoryModel.findOne({ productId }).populate('productId');
            
            if (!priceHistory) {
                // Create default price history if not exists
                const product = await productModel.findById(productId);
                if (!product) {
                    return responseReturn(res, 404, { message: 'Product not found' });
                }

                priceHistory = await this.createDefaultPriceHistory(product);
            }

            // Filter data based on period
            const filteredData = this.filterDataByPeriod(priceHistory.priceHistory, period);
            
            // Calculate additional metrics
            const metrics = this.calculateMetrics(filteredData, priceHistory.currentPrice);

            // Flatten metrics into priceHistory object for frontend compatibility
            const phObj = priceHistory.toObject();
            // Ensure priceRange is always present
            const safePriceRange = phObj.priceRange && typeof phObj.priceRange === 'object'
                ? phObj.priceRange
                : { min: 0, max: 0, avg: 0 };
            responseReturn(res, 200, {
                success: true,
                priceHistory: {
                    priceHistory: filteredData,
                    currentPrice: phObj.currentPrice,
                    marketTrend: phObj.marketTrend,
                    changes: phObj.changes,
                    priceRange: safePriceRange,
                    marketIndicators: phObj.marketIndicators,
                    ...metrics // add metrics if needed
                }
            });

        } catch (error) {
            console.error('Error fetching price history:', error);
            responseReturn(res, 500, { message: 'Error fetching price history', error: error.message });
        }
    };

    // Create default price history for a product
    createDefaultPriceHistory = async (product) => {
        const priceHistory = [];
        const currentDate = new Date();
        const basePrice = product.price;
        
        // Generate 1 year of data
        for (let i = 365; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            
            // Generate realistic price variations
            const variation = this.generatePriceVariation(basePrice, i, product.category);
            const price = Math.round(basePrice * variation);
            
            const change = i === 365 ? 0 : price - (priceHistory[priceHistory.length - 1]?.price || basePrice);
            const changePercent = i === 365 ? 0 : ((change / (priceHistory[priceHistory.length - 1]?.price || basePrice)) * 100);
            
            priceHistory.push({
                price,
                date,
                change,
                changePercent: Math.round(changePercent * 100) / 100,
                volume: Math.floor(Math.random() * 1000) + 100,
                marketCondition: this.getMarketCondition(changePercent)
            });
        }

        const currentPrice = priceHistory[priceHistory.length - 1].price;
        const changes = this.calculateAllChanges(priceHistory, currentPrice);

        return await priceHistoryModel.create({
            productId: product._id,
            currentPrice,
            priceHistory,
            marketTrend: changes.weekly.value > 0 ? 'up' : changes.weekly.value < 0 ? 'down' : 'stable',
            priceRange: {
                min: Math.min(...priceHistory.map(p => p.price)),
                max: Math.max(...priceHistory.map(p => p.price)),
                avg: priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length
            },
            changes,
            marketIndicators: {
                volatility: this.calculateVolatility(priceHistory),
                supportLevel: this.calculateSupportLevel(priceHistory),
                resistanceLevel: this.calculateResistanceLevel(priceHistory),
                trendStrength: this.calculateTrendStrength(priceHistory)
            }
        });
    };

    // Generate realistic price variation based on product category
    generatePriceVariation = (basePrice, daysAgo, category) => {
        const seasonalFactor = this.getSeasonalFactor(daysAgo);
        const categoryVolatility = this.getCategoryVolatility(category);
        const trendFactor = 1 + (daysAgo * 0.0001); // Slight upward trend over time
        
        // Add random variation
        const randomVariation = (Math.random() - 0.5) * categoryVolatility;
        
        return seasonalFactor * trendFactor * (1 + randomVariation);
    };

    // Get seasonal factor based on date
    getSeasonalFactor = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const month = date.getMonth();
        
        // Higher prices in monsoon (June-Sept) and winter (Dec-Feb)
        if (month >= 5 && month <= 8) return 1.05; // Monsoon
        if (month === 11 || month <= 1) return 1.03; // Winter
        return 1.0; // Normal season
    };

    // Get volatility based on product category
    getCategoryVolatility = (category) => {
        const volatilityMap = {
            'Cement & Concrete': 0.08,
            'Steel & Iron': 0.12,
            'Bricks & Blocks': 0.06,
            'Tiles & Flooring': 0.10,
            'Electrical': 0.15,
            'Plumbing': 0.09,
            'Tools & Equipment': 0.07,
            'Paint & Chemicals': 0.11,
            'Hardware & Fasteners': 0.05,
            'Safety & Security': 0.08,
            'Doors & Windows': 0.09
        };
        return volatilityMap[category] || 0.08;
    };

    // Get market condition based on price change
    getMarketCondition = (changePercent) => {
        if (changePercent > 5) return 'bullish';
        if (changePercent < -5) return 'bearish';
        if (Math.abs(changePercent) > 2) return 'volatile';
        return 'stable';
    };

    // Filter data by time period
    filterDataByPeriod = (priceHistory, period) => {
        const now = new Date();
        let days;
        
        switch (period) {
            case '7D': days = 7; break;
            case '1M': days = 30; break;
            case '3M': days = 90; break;
            case '6M': days = 180; break;
            case '1Y': days = 365; break;
            default: days = 30;
        }
        
        const cutoffDate = new Date(now);
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return priceHistory.filter(item => new Date(item.date) >= cutoffDate);
    };

    // Calculate all time period changes
    calculateAllChanges = (priceHistory, currentPrice) => {
        const now = new Date();
        const changes = {};
        
        const periods = [
            { name: 'daily', days: 1 },
            { name: 'weekly', days: 7 },
            { name: 'monthly', days: 30 },
            { name: 'quarterly', days: 90 },
            { name: 'yearly', days: 365 }
        ];
        
        periods.forEach(period => {
            const cutoffDate = new Date(now);
            cutoffDate.setDate(cutoffDate.getDate() - period.days);
            
            const historicalData = priceHistory.filter(item => new Date(item.date) >= cutoffDate);
            const historicalPrice = historicalData.length > 0 ? historicalData[0].price : currentPrice;
            
            const value = currentPrice - historicalPrice;
            const percent = historicalPrice > 0 ? (value / historicalPrice) * 100 : 0;
            
            changes[period.name] = {
                value: Math.round(value * 100) / 100,
                percent: Math.round(percent * 100) / 100
            };
        });
        
        return changes;
    };

    // Calculate additional metrics
    calculateMetrics = (priceHistory, currentPrice) => {
        if (priceHistory.length === 0) return {};
        
        const prices = priceHistory.map(p => p.price);
        const changes = priceHistory.map(p => p.changePercent);
        
        return {
            highest: Math.max(...prices),
            lowest: Math.min(...prices),
            average: Math.round((prices.reduce((a, b) => a + b, 0) / prices.length) * 100) / 100,
            volatility: this.calculateVolatility(priceHistory),
            trend: this.calculateTrend(changes),
            supportLevel: this.calculateSupportLevel(priceHistory),
            resistanceLevel: this.calculateResistanceLevel(priceHistory)
        };
    };

    // Calculate volatility
    calculateVolatility = (priceHistory) => {
        if (priceHistory.length < 2) return 0;
        
        const prices = priceHistory.map(p => p.price);
        const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance = prices.reduce((acc, price) => acc + Math.pow(price - avg, 2), 0) / prices.length;
        
        return Math.round(Math.sqrt(variance) * 100) / 100;
    };

    // Calculate trend
    calculateTrend = (changes) => {
        if (changes.length < 2) return 'stable';
        
        const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
        
        if (avgChange > 1) return 'upward';
        if (avgChange < -1) return 'downward';
        return 'stable';
    };

    // Calculate support level (10th percentile)
    calculateSupportLevel = (priceHistory) => {
        const prices = priceHistory.map(p => p.price).sort((a, b) => a - b);
        const index = Math.floor(prices.length * 0.1);
        return prices[index] || 0;
    };

    // Calculate resistance level (90th percentile)
    calculateResistanceLevel = (priceHistory) => {
        const prices = priceHistory.map(p => p.price).sort((a, b) => a - b);
        const index = Math.floor(prices.length * 0.9);
        return prices[index] || 0;
    };

    // Calculate trend strength
    calculateTrendStrength = (priceHistory) => {
        const volatility = this.calculateVolatility(priceHistory);
        
        if (volatility < 2) return 'weak';
        if (volatility < 5) return 'moderate';
        return 'strong';
    };

    // Get all products with price history
    get_all_products_with_prices = async (req, res) => {
        try {
            const products = await productModel.find({ status: 'active' });
            const productsWithPrices = [];
            
            for (const product of products) {
                const priceHistory = await priceHistoryModel.findOne({ productId: product._id });
                productsWithPrices.push({
                    ...product.toObject(),
                    priceHistory: priceHistory || null
                });
            }
            
            responseReturn(res, 200, { 
                message: 'Products with price history retrieved successfully',
                products: productsWithPrices
            });
            
        } catch (error) {
            console.error('Error fetching products with prices:', error);
            responseReturn(res, 500, { message: 'Error fetching products with prices', error: error.message });
        }
    };

    // Update price for a product
    update_price = async (req, res) => {
        try {
            const { productId } = req.params;
            const { newPrice, volume = 0 } = req.body;

            let priceHistory = await priceHistoryModel.findOne({ productId });
            if (!priceHistory) {
                const product = await productModel.findById(productId);
                if (!product) {
                    return responseReturn(res, 404, { message: 'Product not found' });
                }
                priceHistory = await this.createDefaultPriceHistory(product);
            }

            const oldPrice = priceHistory.currentPrice;
            const change = newPrice - oldPrice;
            const changePercent = oldPrice > 0 ? (change / oldPrice) * 100 : 0;

            // Add new price to history
            priceHistory.priceHistory.push({
                price: newPrice,
                date: new Date(),
                change,
                changePercent: Math.round(changePercent * 100) / 100,
                volume,
                marketCondition: this.getMarketCondition(changePercent)
            });

            // Keep only last 365 days of history
            if (priceHistory.priceHistory.length > 365) {
                priceHistory.priceHistory = priceHistory.priceHistory.slice(-365);
            }

            priceHistory.currentPrice = newPrice;
            priceHistory.lastUpdated = new Date();

            // Update all changes
            priceHistory.changes = this.calculateAllChanges(priceHistory.priceHistory, newPrice);
            
            // Update market trend
            priceHistory.marketTrend = priceHistory.changes.weekly.value > 0 ? 'up' : 
                                     priceHistory.changes.weekly.value < 0 ? 'down' : 'stable';

            // Update price range
            const prices = priceHistory.priceHistory.map(p => p.price);
            priceHistory.priceRange = {
                min: Math.min(...prices),
                max: Math.max(...prices),
                avg: prices.reduce((a, b) => a + b, 0) / prices.length
            };

            // Update market indicators
            priceHistory.marketIndicators = {
                volatility: this.calculateVolatility(priceHistory.priceHistory),
                supportLevel: this.calculateSupportLevel(priceHistory.priceHistory),
                resistanceLevel: this.calculateResistanceLevel(priceHistory.priceHistory),
                trendStrength: this.calculateTrendStrength(priceHistory.priceHistory)
            };

            await priceHistory.save();

            responseReturn(res, 200, { 
                message: 'Price updated successfully', 
                priceHistory: priceHistory 
            });

        } catch (error) {
            console.error('Error updating price:', error);
            responseReturn(res, 500, { message: 'Error updating price', error: error.message });
        }
    };
}

module.exports = new priceHistoryController();
