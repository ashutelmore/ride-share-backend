var express = require('express');
var router = express.Router();
const { createVehicles, updateVehicles, getVehicles, deleteVehicles } = require('../controllers/Vehicles');
const uploads = require('./../middlewares/multerFileUpload')
/* GET users listing. */
router.post('/createVehicles', uploads.single('vehicleImg'), createVehicles)
router.put('/updateVehicles/:id?', uploads.single('vehicleImg'), updateVehicles)
router.get('/getVehicles?', getVehicles)
router.delete('/deleteVehicles/:id?', deleteVehicles)

module.exports = router;
