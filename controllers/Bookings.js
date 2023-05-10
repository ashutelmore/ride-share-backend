const { ERRORS } = require('../helper/constants');
const { isEmpty, isInalidMongoDBid } = require('../helper/helper');
const Posts = require('../models/Posts');
const Requests = require('../models/Requests');
const Bookings = require('../models/Bookings');
const Meetings = require('../models/Meeting');
const UserDetails = require('../models/UserDetails');
const multer = require('multer');


exports.createBookings = async (req, res) => {
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

    const newData = new Bookings(payload)

    return await newData.save().then(async (data) => {
        res.status(201).json({
            message: 'Bookings created successfully',
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

exports.updateBookings = async (req, res, next) => {
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


    return await Bookings.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true }).then(async (data) => {

            if (!data)
                return res.status(404).json({
                    error: {
                        errCode: ERRORS.NOT_FOUND,
                        errMessage: "Bookings does not exists"
                    }
                })
            return res.status(201).json({
                message: 'Bookings data updated successfully',
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


exports.getBookings = async (req, res, next) => {

    const driverId = req.query.driverId || '';
    const vehicleId = req.query.vehicleId || '';
    const rideId = req.query.rideId || '';
    const bookingId = req.query.bookingId || '';

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
            rideId: rideId,
        }

    } else if (bookingId != '') {
        findQuery = {
            _id: bookingId,
        }
    }



    console.log('findQuery', findQuery)
    try {
        const resp = await Bookings.find(findQuery)
        if (!resp)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "Bookings not exists"
                }
            })

        return res.status(201).json({
            message: 'Bookings fetch successfully',
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

