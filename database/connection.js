require("dotenv").config()

const mongoose = require("mongoose")

// Database URL

const DB_URI = "mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASS+"@"+process.env.CLUSTER+"mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority"

const connectToDatabase = () => {
    mongoose.set("strictQuery", false);
    return mongoose.connect(DB_URI)
}

// Export function to connect to database

module.exports = connectToDatabase ;
