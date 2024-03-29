var express = require('express');
var router = express.Router();
const { createRides, updateRides, getRides } = require('../controllers/Rides');
const { createBookings, updateBookings, getBookings, deleteBookings } = require('../controllers/Bookings');

/* GET users listing. */
router.post('/createBookings', createBookings)
router.put('/updateBookings/:id?', updateBookings)
router.get('/getBookings?', getBookings)


router.delete('/deleteBookings/:id', deleteBookings)


module.exports = router;
