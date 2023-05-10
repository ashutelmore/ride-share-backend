var express = require('express');
var router = express.Router();
const { createVehicles, updateVehicles, getVehicles } = require('../controllers/Vehicles');

/* GET users listing. */
router.post('/createVehicles', createVehicles)
router.put('/updateVehicles/:id?', updateVehicles)
router.get('/getVehicles?', getVehicles)

module.exports = router;
