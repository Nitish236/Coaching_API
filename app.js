require('express-async-errors');
require("dotenv").config()

const express = require("express");
const app = express();

const connectToDatabase = require("./database/connection");

// Importing Routers

// Importing authenticate

// Importing error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');




app.use(express.urlencoded({extended:false}))
app.use(express.json());


// Importing Routes




// Middleware
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

async function startServer() {
    try {
        // await connectToDatabase()
        // console.log("Connected to Database -- ");
        
        app.listen(process.env.PORT, ()=>{
            console.log(`Server listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error -- ", error)
    }
}

startServer()