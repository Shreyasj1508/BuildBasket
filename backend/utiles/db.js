const mongoose = require('mongoose');

module.exports.dbConnect = async()=>{
    try {
        // Local MongoDB connection only
        const dbUrl = 'mongodb://localhost:27017/almaMate';
        
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("✅ Database connected to:", dbUrl);
    } catch (error) {
        console.log("❌ Database connection error:", error.message);
        console.log("💡 Make sure MongoDB is running locally: 'mongod'");
    }
}