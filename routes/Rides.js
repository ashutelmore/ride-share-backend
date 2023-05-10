var express = require('express');
var router = express.Router();
const { createRides, updateRides, getRides } = require('../controllers/Rides');

/* GET users listing. */
router.post('/createRides', createRides)
router.put('/updateRides/:id?', updateRides)
router.get('/getRides?', getRides)

module.exports = router;
