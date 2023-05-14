//modules
const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors');

require('dotenv').config({ path: './.env.local' })//.env.production.local
// require('dotenv').config({ path: './.env.production.local' })//.env.production.local
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL
const app = express()
app.use(express.json())
// app.use(express.urlencoded())
app.use(cors())
app.use(express.static(`${__dirname}/public`));
//routes
const Users = require('./routes/Users')
const Vehicles = require('./routes/Vehicles')
const Rides = require('./routes/Rides')
const Bookings = require('./routes/Bookings')

//mongoDB

const connect = async () => {
    return await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('DB connected');
        return 1
    }).catch((err) => {
        console.log('err :>> ', err);
        return 0
    });
};


//routes
app.get('/', (req, res) => [
    res.status(200).json({
        message: "To get access for APIs. please! contact on ashwintelmore@gmail.com"
    })
])
app.use('/api', Users)
app.use('/api', Vehicles)
app.use('/api', Rides)
app.use('/api', Bookings)

//port

if (connect()) {
    app.listen(PORT, function () {
        console.log("Run on port", PORT)
    })
}