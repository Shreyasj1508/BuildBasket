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

// Categories data
const categories = [
    {
        name: 'Cement & Concrete',
        slug: 'cement-concrete',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop'
    },
    {
        name: 'Steel & Iron',
        slug: 'steel-iron',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop'
    },
    {
        name: 'Bricks & Blocks',
        slug: 'bricks-blocks',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'
    },
    {
        name: 'Tiles & Flooring',
        slug: 'tiles-flooring',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    },
    {
        name: 'Electrical',
        slug: 'electrical',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop'
    },
    {
        name: 'Plumbing',
        slug: 'plumbing',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop'
    },
    {
        name: 'Tools & Equipment',
        slug: 'tools-equipment',
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=200&fit=crop'
    },
    {
        name: 'Paint & Chemicals',
        slug: 'paint-chemicals',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop'
    },
    {
        name: 'Hardware & Fasteners',
        slug: 'hardware-fasteners',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'
    },
    {
        name: 'Safety & Security',
        slug: 'safety-security',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&h=200&fit=crop'
    },
    {
        name: 'Doors & Windows',
        slug: 'doors-windows',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    },
    {
        name: 'Roofing Materials',
        slug: 'roofing-materials',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop'
    },
    {
        name: 'Insulation',
        slug: 'insulation',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop'
    },
    {
        name: 'Garden & Outdoor',
        slug: 'garden-outdoor',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop'
    },
    {
        name: 'Kitchen & Bathroom',
        slug: 'kitchen-bathroom',
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=200&fit=crop'
    },
    {
        name: 'Lumber & Wood',
        slug: 'lumber-wood',
        image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=300&h=200&fit=crop'
    },
    {
        name: 'Glass & Mirrors',
        slug: 'glass-mirrors',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop'
    },
    {
        name: 'HVAC & Ventilation',
        slug: 'hvac-ventilation',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop'
    },
    {
        name: 'Landscaping',
        slug: 'landscaping',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop'
    },
    {
        name: 'Lighting & Fixtures',
        slug: 'lighting-fixtures',
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=300&h=200&fit=crop'
    }
];

// Seed categories
const seedCategories = async () => {
    try {
        // Clear existing categories
        await categoryModel.deleteMany({});
        console.log('Cleared existing categories');

        // Add new categories
        for (const category of categories) {
            await categoryModel.create(category);
            console.log(`✅ Category created: ${category.name}`);
        }

        console.log(`🎉 Successfully seeded ${categories.length} categories!`);
        
    } catch (error) {
        console.error('❌ Error seeding categories:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

// Run seeder
const runSeeder = async () => {
    await connectDB();
    await seedCategories();
};

runSeeder();
