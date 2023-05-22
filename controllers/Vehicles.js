const { ERRORS } = require('../helper/constants');
const { isEmpty, isInalidMongoDBid } = require('../helper/helper');
const Vehicles = require('../models/Vehicles');
const fs = require('file-system');

exports.createVehicles = async (req, res) => {
    const {
        payload
    } = req.body;
    let data = {
        ...JSON.parse(payload),
    }
    console.log('req.file', req.file)
    if (req.file) {
        data = {
            ...data,
            image: {
                data: fs.readFileSync(req.file.path),
                contentType: req.file.mimetype
            }
        }
    }

    if (!payload)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong with data"
            }
        })


    const newData = new Vehicles(data)

    return await newData.save().then(async (_data) => {


        res.status(201).json({
            message: 'Vehicles created successfully',
            payload: _data
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

    if (!payload)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong with data"
            }
        })

    let data = {
        ...JSON.parse(payload),
    }
    if (req.file) {
        data = {
            ...data,
            image: {
                data: fs.readFileSync(req.file.path),
                contentType: req.file.mimetype
            }
        }
    }

    return await Vehicles.findByIdAndUpdate(
        id,
        { ...data },
        { new: true }).then(async (_data) => {

            if (!_data)
                return res.status(404).json({
                    error: {
                        errCode: ERRORS.NOT_FOUND,
                        errMessage: "Vehicles does not exists"
                    }
                })
            return res.status(201).json({
                message: 'Vehicles data updated successfully',
                payload: _data
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


exports.getVehicles = async (req, res, next) => {

    const driverId = req.query.driverId || '';
    const vehicleId = req.query.vehicleId || '';
    const status = req.query.status || '';
    const limit = req.query.limit || 20;
    const type = req.query.type || '';

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
    } else if (driverId != '' && status != '') {
        findQuery = {
            driverId: driverId,
            status: status,
        }
    } else if (driverId != '') {
        findQuery = {
            driverId: driverId,
        }
    } else if (type == 'isAvailableForBook') {
        findQuery = {
            isAvailableForBook: true
        }
    }

    try {
        const resp = await Vehicles.find(findQuery)
            .limit(limit)
            .populate('driverId')
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
        console.log('error', error)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    }
}

exports.deleteVehicles = async (req, res, next) => {
    const {
        id
    } = req.params;

    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)


    return await Vehicles.deleteOne({
        _id: id
    }).then(async (data) => {
        console.log('data control', data)
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
