const mongoose = require('mongoose');
const categoryModel = require('./models/categoryModel');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/almaMate');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Test categories
const testCategories = async () => {
    try {
        const categories = await categoryModel.find({});
        console.log(`📊 Total categories found: ${categories.length}`);
        
        if (categories.length > 0) {
            console.log('\n📋 Categories list:');
            categories.forEach((category, index) => {
                console.log(`${index + 1}. ${category.name} (${category.slug})`);
            });
        } else {
            console.log('❌ No categories found in database');
        }
        
    } catch (error) {
        console.error('❌ Error fetching categories:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

// Run test
const runTest = async () => {
    await connectDB();
    await testCategories();
};

runTest();
