const { ERRORS } = require('../helper/constants');
const { isEmpty, isInalidMongoDBid, isEmptyObj } = require('../helper/helper');
const Bookings = require('../models/Booking');


exports.createBookings = async (req, res) => {
    const {
        payload
    } = req.body;
    console.log('req.body', req.body)
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


exports.getOneBookings = async (req, res, next) => {

    const passangerId = req.query.passangerId || '';
    const driverId = req.query.driverId || '';
    const vehicleId = req.query.vehicleId || '';
    const rideId = req.query.rideId || '';
    const bookingId = req.query.bookingId || '';

    let findQuery = {}
    if (!isEmpty(driverId, rideId)) {
        findQuery = {
            driverId: driverId,
            rideId: rideId
        }
    } else if (!isEmpty(passangerId, rideId)) {
        findQuery = {
            passangerId: passangerId,
            rideId: rideId
        }
    } else if (!isEmpty(passangerId)) {
        findQuery = {
            passangerId: passangerId
        }
    } else if (!isEmpty(bookingId)) {
        findQuery = {
            _id: bookingId
        }
    }
    if (isEmptyObj(findQuery))
        return res.status(201).json({
            message: 'Bookings fetch successfully',
            payload: []
        })

    console.log('findQuery booking', findQuery)
    try {
        const resp = await Bookings.find(findQuery)
            .sort({ updatedAt: -1 })
            .populate('driverId')
            .populate('passangerId')
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
        console.log('error', error)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    }
}
exports.getBookings = async (req, res, next) => {

    const passangerId = req.query.passangerId || '';
    const driverId = req.query.driverId || '';
    const vehicleId = req.query.vehicleId || '';
    const rideId = req.query.rideId || '';
    const bookingId = req.query.bookingId || '';
    const role = req.query.role || '';


    console.log('req.query', req.query)


    let findQuery = {}
    if (!isEmpty(driverId, rideId)) {
        findQuery = {
            driverId: driverId,
            rideId: rideId
        }
    } else if (!isEmpty(passangerId, rideId)) {
        findQuery = {
            passangerId: passangerId,
            rideId: rideId
        }
    } else if (!isEmpty(passangerId)) {
        findQuery = {
            passangerId: passangerId
        }
    } else if (!isEmpty(bookingId)) {
        findQuery = {
            _id: bookingId
        }
    } else if (!isEmpty(rideId)) {
        findQuery = {
            rideId: rideId
        }
    }

    if (!isEmpty(role)) {
        findQuery = {}
    } else if (isEmptyObj(findQuery))
        return res.status(201).json({
            message: 'Bookings fetch successfully',
            payload: []
        })

    console.log('findQuery booking', findQuery)
    try {
        const resp = await Bookings.find(findQuery)
            .sort({ updatedAt: -1 })
            .populate('driverId')
            .populate('passangerId')
            .populate('rideId')
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
        console.log('error', error)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    }
}

exports.deleteBookings = async (req, res, next) => {
    const {
        id
    } = req.params;

    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)


    return await Bookings.deleteOne({
        _id: id
    }).then(async (data) => {
        console.log('data', data)
        if (!data)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "Vehicles does not exists"
                }
            })
        return res.status(201).json({
            message: 'Vehicles data deleted successfully',
            payload: data
        })

    }).catch((err) => {
        console.log('err', err)
        return res.status(404).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    })
}


