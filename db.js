const mongoose = require('mongoose');
const dotenv = require('dotenv')

// Load environment variables from .env file
dotenv.config();
// Get the MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;


 const connectDb = async()=>{
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected')
    
    } catch (err) {
        console.log('Error connecting to MongoDB')
        console.error(err);
        process.exit(1);
    }

 }
 module.exports = connectDb