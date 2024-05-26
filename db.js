const mongoose = require('mongoose');
const { MONGO_URI } = process.env;


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