const { ERRORS } = require('../helper/constants');
const { isEmpty, isInalidMongoDBid } = require('../helper/helper');
const Posts = require('../models/Posts');
const Requests = require('../models/Requests');
const Vehicles = require('../models/Vehicles');
const Meetings = require('../models/Meeting');
const UserDetails = require('../models/UserDetails');
const multer = require('multer');


exports.createVehicles = async (req, res) => {
    const {
        payload
    } = req.body;

    if (!payload)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong with data"
            }
        })

    const newData = new Vehicles(payload)

    return await newData.save().then(async (data) => {


        res.status(201).json({
            message: 'Vehicles created successfully',
            payload: data
        })
    }).catch((err) => {
        console.log('err', err)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    })
}

exports.updateVehicles = async (req, res, next) => {
    const {
        payload
    } = req.body;

    const {
        id
    } = req.params;

    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)


    return await Vehicles.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true }).then(async (data) => {

            if (!data)
                return res.status(404).json({
                    error: {
                        errCode: ERRORS.NOT_FOUND,
                        errMessage: "Vehicles does not exists"
                    }
                })
            return res.status(201).json({
                message: 'Vehicles data updated successfully',
                payload: data
            })

        }).catch((err) => {
            return res.status(404).json({
                error: {
                    errCode: ERRORS.SOMETHING_WRONG,
                    errMessage: "Something went wrong"
                }
            })
        })
}


exports.getVehicles = async (req, res, next) => {
    const {
        driverId,
        vehicleId
    } = req.query;

    let findQuery = {}
    if (vehicleId != '' && driverId != '') {
        findQuery = {
            driverId: driverId,
            _id: vehicleId
        }
    } else if (vehicleId != '') {
        findQuery = {
            _id: vehicleId,
        }
    } else if (driverId != '') {
        findQuery = {
            driverId: driverId,
        }
    }


    console.log('findQuery', findQuery)
    try {
        const resp = await Vehicles.find(findQuery)
        if (!resp)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "Vehicles not exists"
                }
            })

        return res.status(201).json({
            message: 'Vehicles fetch successfully',
            payload: resp
        })

    } catch (error) {
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    }
}

