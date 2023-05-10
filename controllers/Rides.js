const { ERRORS } = require('../helper/constants');
const { isEmpty, isInalidMongoDBid } = require('../helper/helper');
const Posts = require('../models/Posts');
const Requests = require('../models/Requests');
const Rides = require('../models/Rides');
const Meetings = require('../models/Meeting');
const UserDetails = require('../models/UserDetails');
const multer = require('multer');


exports.createRides = async (req, res) => {
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

    const newData = new Rides(payload)

    return await newData.save().then(async (data) => {
        res.status(201).json({
            message: 'Rides created successfully',
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

exports.updateRides = async (req, res, next) => {
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


    return await Rides.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true }).then(async (data) => {

            if (!data)
                return res.status(404).json({
                    error: {
                        errCode: ERRORS.NOT_FOUND,
                        errMessage: "Rides does not exists"
                    }
                })
            return res.status(201).json({
                message: 'Rides data updated successfully',
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


exports.getRides = async (req, res, next) => {

    const driverId = req.query.driverId || '';
    const vehicleId = req.query.vehicleId || '';
    const rideId = req.query.rideId || '';
    const startDate = req.query.startDate || '';
    const endDate = req.query.endDate || '';

    let findQuery = {}
    if (vehicleId != '' && driverId != '') {
        findQuery = {
            driverId: driverId,
            vehicleId: vehicleId
        }
    } else if (vehicleId != '') {
        findQuery = {
            vehicleId: vehicleId,
        }
    } else if (driverId != '') {
        findQuery = {
            driverId: driverId,
        }

    } else if (rideId != '') {
        findQuery = {
            _id: rideId,
        }
    }


    console.log('findQuery', findQuery)
    try {
        const resp = await Rides.find(findQuery)
        if (!resp)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "Rides not exists"
                }
            })

        return res.status(201).json({
            message: 'Rides fetch successfully',
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

