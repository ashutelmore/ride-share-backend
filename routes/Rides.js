var express = require('express');
var router = express.Router();
const { createRides, updateRides, getRides, deleteRides, searchRides } = require('../controllers/Rides');

/* GET users listing. */
router.post('/createRides', createRides)
router.put('/updateRides/:id?', updateRides)
router.get('/getRides?', getRides)
router.get('/searchRides?', searchRides)

router.delete('/deleteRides/:id?', deleteRides)



module.exports = router;
