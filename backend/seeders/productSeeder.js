const mongoose = require('mongoose');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const sellerModel = require('../models/sellerModel');

// Sample data for products
const sampleProducts = [
    {
        name: "Emergency Light LED",
        slug: "emergency-light-led",
        category: "Electronics",
        brand: "Philips",
        price: 1500,
        stock: 25,
        discount: 10,
        description: "High-quality LED emergency light with long battery life and automatic charging. Perfect for homes and offices.",
        shopName: "Build Materials Pro",
        images: [
            "emergency-light-1.jpg",
            "emergency-light-2.jpg",
            "emergency-light-3.jpg"
        ],
        sellerId: new mongoose.Types.ObjectId(),
        status: "active",
        rating: 4.5,
        location: {
            state: "Maharashtra",
            city: "Mumbai",
            region: "Western"
        },
        eligibleForCreditSale: true
    },
    {
        name: "Smart LED Bulb",
        slug: "smart-led-bulb",
        category: "Electronics",
        brand: "Wipro",
        price: 899,
        stock: 50,
        discount: 15,
        description: "WiFi enabled smart LED bulb with app control and voice assistant compatibility.",
        shopName: "Tech Solutions",
        images: [
            "smart-bulb-1.jpg",
            "smart-bulb-2.jpg"
        ],
        sellerId: new mongoose.Types.ObjectId(),
        status: "active",
        rating: 4.2,
        location: {
            state: "Maharashtra",
            city: "Pune",
            region: "Western"
        },
        eligibleForCreditSale: false
    },
    {
        name: "Industrial Ceiling Fan",
        slug: "industrial-ceiling-fan",
        category: "Electrical",
        brand: "Crompton",
        price: 3200,
        stock: 15,
        discount: 5,
        description: "Heavy-duty industrial ceiling fan with high airflow and energy efficiency.",
        shopName: "Electrical Hub",
        images: [
            "ceiling-fan-1.jpg",
            "ceiling-fan-2.jpg",
            "ceiling-fan-3.jpg"
        ],
        sellerId: new mongoose.Types.ObjectId(),
        status: "active",
        rating: 4.7,
        location: {
            state: "Gujarat",
            city: "Ahmedabad",
            region: "Western"
        },
        eligibleForCreditSale: true
    },
    {
        name: "Power Drill Machine",
        slug: "power-drill-machine",
        category: "Tools",
        brand: "Bosch",
        price: 4500,
        stock: 30,
        discount: 12,
        description: "Professional power drill with variable speed and multiple attachments included.",
        shopName: "Tools & More",
        images: [
            "drill-1.jpg",
            "drill-2.jpg"
        ],
        sellerId: new mongoose.Types.ObjectId(),
        status: "active",
        rating: 4.8,
        location: {
            state: "Karnataka",
            city: "Bangalore",
            region: "Southern"
        },
        eligibleForCreditSale: true
    },
    {
        name: "Safety Helmet",
        slug: "safety-helmet",
        category: "Safety",
        brand: "3M",
        price: 1200,
        stock: 100,
        discount: 8,
        description: "Industrial safety helmet with adjustable headband and ventilation.",
        shopName: "Safety First",
        images: [
            "helmet-1.jpg",
            "helmet-2.jpg"
        ],
        sellerId: new mongoose.Types.ObjectId(),
        status: "active",
        rating: 4.3,
        location: {
            state: "Tamil Nadu",
            city: "Chennai",
            region: "Southern"
        },
        eligibleForCreditSale: false
    }
];

// Sample categories
const sampleCategories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Electrical", slug: "electrical" },
    { name: "Tools", slug: "tools" },
    { name: "Safety", slug: "safety" },
    { name: "Lighting", slug: "lighting" }
];

// Sample sellers
const sampleSellers = [
    {
        name: "Build Materials Pro",
        email: "buildmaterials@example.com",
        phone: "9876543210",
        shopName: "Build Materials Pro",
        status: "active"
    },
    {
        name: "Tech Solutions",
        email: "techsolutions@example.com",
        phone: "9876543211",
        shopName: "Tech Solutions",
        status: "active"
    },
    {
        name: "Electrical Hub",
        email: "electricalhub@example.com",
        phone: "9876543212",
        shopName: "Electrical Hub",
        status: "active"
    },
    {
        name: "Tools & More",
        email: "toolsmore@example.com",
        phone: "9876543213",
        shopName: "Tools & More",
        status: "active"
    },
    {
        name: "Safety First",
        email: "safetyfirst@example.com",
        phone: "9876543214",
        shopName: "Safety First",
        status: "active"
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data
        await productModel.deleteMany({});
        await categoryModel.deleteMany({});
        await sellerModel.deleteMany({});

        // Insert categories
        console.log('📁 Inserting categories...');
        await categoryModel.insertMany(sampleCategories);

        // Insert sellers
        console.log('👥 Inserting sellers...');
        const insertedSellers = await sellerModel.insertMany(sampleSellers);

        // Update products with actual seller IDs
        sampleProducts.forEach((product, index) => {
            product.sellerId = insertedSellers[index]._id;
        });

        // Insert products
        console.log('📦 Inserting products...');
        await productModel.insertMany(sampleProducts);

        console.log('✅ Database seeding completed successfully!');
        console.log(`📊 Seeded ${sampleCategories.length} categories, ${sampleSellers.length} sellers, and ${sampleProducts.length} products`);

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
    }
};

module.exports = { seedDatabase, sampleProducts, sampleCategories, sampleSellers };
