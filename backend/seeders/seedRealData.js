const mongoose = require('mongoose');
const commissionModel = require('../models/commissionModel');
const categoryModel = require('../models/categoryModel');
const sellerModel = require('../models/sellerModel');
const buyerModel = require('../models/buyerModel');
const productModel = require('../models/productModel');
const commodityModel = require('../models/commodityModel');
const { calculateCommissionSyncSync } = require('../utiles/commissionUtils');

const seedRealData = async () => {
    try {
        console.log('🌱 Seeding real data...');

        // 1. Seed Commission Data
        const existingCommission = await commissionModel.findOne({ name: 'Default Platform Commission' });
        if (!existingCommission) {
            await commissionModel.create({
                name: 'Default Platform Commission',
                type: 'percentage',
                rate: 5,
                description: 'Standard 5% commission for all products',
                isActive: true,
                applicableTo: 'all',
                effectiveFrom: new Date()
            });
            console.log('✅ Commission data seeded');
        }

        // 2. Seed Categories
        const categories = [
            { name: 'Construction Materials', slug: 'construction-materials', description: 'Building and construction materials' },
            { name: 'Steel Products', slug: 'steel-products', description: 'Steel rods, sheets, and structural materials' },
            { name: 'Cement & Concrete', slug: 'cement-concrete', description: 'Cement, concrete, and related products' },
            { name: 'Sand & Aggregates', slug: 'sand-aggregates', description: 'Sand, gravel, and construction aggregates' },
            { name: 'Electrical', slug: 'electrical', description: 'Electrical equipment and supplies' },
            { name: 'Plumbing', slug: 'plumbing', description: 'Plumbing fixtures and materials' }
        ];

        for (const category of categories) {
            const existingCategory = await categoryModel.findOne({ slug: category.slug });
            if (!existingCategory) {
                await categoryModel.create(category);
            }
        }
        console.log('✅ Categories seeded');

        // 3. Seed Sellers
        const sellers = [
            {
                name: 'Steel Suppliers Ltd',
                email: 'steel@suppliers.com',
                phone: '9876543210',
                password: 'steel123',
                method: 'card',
                status: 'active',
                isVerified: true,
                shopInfo: {
                    shopName: 'Steel Suppliers Ltd',
                    address: 'Industrial Area, Mumbai',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pincode: '400001'
                }
            },
            {
                name: 'Cement Distributors',
                email: 'cement@distributors.com',
                phone: '9876543211',
                password: 'cement123',
                method: 'card',
                status: 'active',
                isVerified: true,
                shopInfo: {
                    shopName: 'Cement Distributors',
                    address: 'Commercial Zone, Pune',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411001'
                }
            },
            {
                name: 'Sand Traders',
                email: 'sand@traders.com',
                phone: '9876543212',
                password: 'sand123',
                method: 'card',
                status: 'active',
                isVerified: true,
                shopInfo: {
                    shopName: 'Sand Traders',
                    address: 'River Side, Nashik',
                    city: 'Nashik',
                    state: 'Maharashtra',
                    pincode: '422001'
                }
            }
        ];

        const createdSellers = [];
        for (const seller of sellers) {
            const existingSeller = await sellerModel.findOne({ email: seller.email });
            if (!existingSeller) {
                const newSeller = await sellerModel.create(seller);
                createdSellers.push(newSeller);
            } else {
                createdSellers.push(existingSeller);
            }
        }
        console.log('✅ Sellers seeded');

        // 4. Seed Buyers
        const buyers = [
            {
                name: 'ABC Construction',
                email: 'abc@construction.com',
                phone: '9876543213',
                password: 'abc123',
                company: 'ABC Construction Pvt Ltd',
                creditLimit: 500000,
                creditUsed: 125000,
                creditStatus: 'active',
                isVerified: true
            },
            {
                name: 'XYZ Builders',
                email: 'xyz@builders.com',
                phone: '9876543214',
                password: 'xyz123',
                company: 'XYZ Builders & Developers',
                creditLimit: 750000,
                creditUsed: 200000,
                creditStatus: 'active',
                isVerified: true
            },
            {
                name: 'DEF Developers',
                email: 'def@developers.com',
                phone: '9876543215',
                password: 'def123',
                company: 'DEF Real Estate Developers',
                creditLimit: 1000000,
                creditUsed: 350000,
                creditStatus: 'active',
                isVerified: true
            }
        ];

        for (const buyer of buyers) {
            const existingBuyer = await buyerModel.findOne({ email: buyer.email });
            if (!existingBuyer) {
                await buyerModel.create(buyer);
            }
        }
        console.log('✅ Buyers seeded');

        // 5. Seed Products
        const products = [
            {
                name: 'Steel Rod 12mm',
                slug: 'steel-rod-12mm',
                price: 450.00,
                category: 'Steel Products',
                brand: 'Tata Steel',
                sellerId: createdSellers[0]._id,
                shopName: 'Steel Suppliers Ltd',
                images: ['steel-rod-12mm-1.jpg', 'steel-rod-12mm-2.jpg'],
                description: 'High quality TMT steel rod 12mm diameter, suitable for construction and reinforcement work',
                stock: 100,
                discount: 5,
                rating: 4.5,
                status: 'active',
                location: {
                    state: 'Maharashtra',
                    city: 'Mumbai',
                    region: 'Western'
                },
                eligibleForCreditSale: true,
                ...calculateCommissionSyncSync(450.00)
            },
            {
                name: 'Portland Cement 50kg',
                slug: 'portland-cement-50kg',
                price: 320.00,
                category: 'Cement & Concrete',
                brand: 'UltraTech',
                sellerId: createdSellers[1]._id,
                shopName: 'Cement Distributors',
                images: ['cement-50kg-1.jpg', 'cement-50kg-2.jpg'],
                description: 'Premium quality Portland cement 50kg bag, ideal for all construction purposes',
                stock: 50,
                discount: 8,
                rating: 4.3,
                status: 'active',
                location: {
                    state: 'Maharashtra',
                    city: 'Pune',
                    region: 'Western'
                },
                eligibleForCreditSale: true,
                ...calculateCommissionSyncSync(320.00)
            },
            {
                name: 'Fine Sand 1 Ton',
                slug: 'fine-sand-1-ton',
                price: 1800.00,
                category: 'Sand & Aggregates',
                brand: 'River Sand',
                sellerId: createdSellers[2]._id,
                shopName: 'Sand Traders',
                images: ['sand-1ton-1.jpg', 'sand-1ton-2.jpg'],
                description: 'Clean fine sand 1 ton, perfect for construction and masonry work',
                stock: 25,
                discount: 10,
                rating: 4.2,
                status: 'active',
                location: {
                    state: 'Maharashtra',
                    city: 'Nashik',
                    region: 'Northern'
                },
                eligibleForCreditSale: false,
                ...calculateCommissionSyncSync(1800.00)
            }
        ];

        for (const product of products) {
            const existingProduct = await productModel.findOne({ slug: product.slug });
            if (!existingProduct) {
                await productModel.create(product);
            }
        }
        console.log('✅ Products seeded');

        // 6. Seed Commodities
        const commodities = [
            {
                name: 'Steel Rod',
                category: 'Construction',
                description: 'Reinforcement steel rods for construction',
                unit: 'KG',
                basePrice: 45.00
            },
            {
                name: 'Portland Cement',
                category: 'Construction',
                description: 'Binding material for construction',
                unit: 'Bag',
                basePrice: 320.00
            },
            {
                name: 'Fine Sand',
                category: 'Construction',
                description: 'Construction sand for masonry work',
                unit: 'Ton',
                basePrice: 1800.00
            },
            {
                name: 'Coarse Sand',
                category: 'Construction',
                description: 'Coarse sand for concrete work',
                unit: 'Ton',
                basePrice: 1600.00
            },
            {
                name: 'Aggregate 20mm',
                category: 'Construction',
                description: '20mm coarse aggregate for concrete',
                unit: 'Ton',
                basePrice: 1200.00
            }
        ];

        for (const commodity of commodities) {
            const existingCommodity = await commodityModel.findOne({ name: commodity.name });
            if (!existingCommodity) {
                await commodityModel.create(commodity);
            }
        }
        console.log('✅ Commodities seeded');

        console.log('🎉 All real data seeded successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
};

module.exports = seedRealData;
