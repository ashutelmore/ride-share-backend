const { ERRORS } = require('../helper/constants');
const { isEmpty, isInalidMongoDBid } = require('../helper/helper');
const Rides = require('../models/Rides');
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
    const _id = req.query._id || '';


    console.log('req.query', req.query)

    const pickup = req.query.pickup || '';
    const desti = req.query.desti || '';
    const start = req.query.start || '';
    const end = req.query.end || '';



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

    } else if (_id != '') {
        findQuery = {
            _id: _id,
        }
    }


    try {
        const resp = await Rides.find(findQuery)
            .populate('driverId')
            .populate('vehicleId')
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
exports.searchRides = async (req, res, next) => {


    const pickup = req.query.pickup || '';
    const desti = req.query.desti || '';
    const start = req.query.start || '';
    const end = req.query.end || '';


    console.log('req.query', req.query)
    let findQuery = {}


    if (!isEmpty(start, end, pickup, desti)) {
        findQuery = {
            startDate: { $gte: start },
            endDate: { $lte: end },
            pickupLocation: { $regex: pickup, $options: "i" },
            destination: { $regex: desti, $options: "i" },
        }
    } else if (!isEmpty(start, end) && isEmpty(pickup, desti)) {
        findQuery = {

            $and: [
                { startDate: { $gte: start } }
                , { endDate: { $lte: end } }
            ]
            // startDate: { $gte: start },
            // endDate: { $lte: end },
        }
    } else if (isEmpty(start, end) && !isEmpty(pickup, desti)) {
        findQuery = {
            pickupLocation: { $regex: pickup, $options: "i" },
            destination: { $regex: desti, $options: "i" },
        }
    }

    console.log('findQuery', findQuery)
    try {
        const resp = await Rides.find(findQuery)
            .populate('driverId')
            .populate('vehicleId')
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

exports.deleteRides = async (req, res, next) => {
    const {
        id
    } = req.params;

    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)


    return await Rides.deleteOne({
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
