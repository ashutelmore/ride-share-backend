var express = require('express');
var router = express.Router();
const { createVehicles, updateVehicles, getVehicles, deleteVehicles } = require('../controllers/Vehicles');
const uploads = require('./../middlewares/multerFileUpload');
const { ERRORS } = require('../helper/constants');
/* GET users listing. */

const fileSizeLimitErrorHandler = async (err, req, res, next) => {
    console.log('res.files', res.files)
    console.log('res.file', res.file)
    if (err) {
        console.log('err', err)
        return res.status(413).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "file size exceeded or try another file format"
            }
        })
    } else {
        next()
    }
}

router.post('/createVehicles', uploads.single('vehicleImg'), fileSizeLimitErrorHandler, createVehicles)
router.put('/updateVehicles/:id?', uploads.single('vehicleImg'), fileSizeLimitErrorHandler, updateVehicles)
router.get('/getVehicles?', getVehicles)
router.delete('/deleteVehicles/:id?', deleteVehicles)

module.exports = router;
