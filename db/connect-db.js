import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async() => {
    const mongodb_url = process.env.MONGO_URL

    try{
        await mongoose.connect(mongodb_url, {})
        console.log('Database connection established');
    }catch(err){
        console.log('Error connecting to the database');
    }
}

export default connectDB