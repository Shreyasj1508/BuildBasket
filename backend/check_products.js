const mongoose = require('mongoose');
const productModel = require('./models/productModel');
require('dotenv').config();

const checkProducts = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to MongoDB');

        const products = await productModel.find({}).sort({createdAt: -1}).limit(5);
        console.log('Latest products:');
        products.forEach(p => {
            console.log(`- Name: ${p.name}`);
            console.log(`  Images: ${JSON.stringify(p.images)}`);
            console.log(`  Created: ${p.createdAt}`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

checkProducts();
