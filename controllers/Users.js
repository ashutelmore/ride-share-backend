const { ERRORS } = require("../helper/constants");
const { isEmpty, isInalidMongoDBid } = require("../helper/helper");
const Users = require("../models/Users")




exports.register = async (req, res, next) => {
    const { name, email, password } = req.body;

    console.log('req.body', req.body)
    const isE = isEmpty(name, email, password);
    if (isE)
        return res.status(200).json(isE);

    try {
        const user = await Users.findOne({ email: email })

        if (user) {
            return res.status(208).json({
                error: {
                    errCode: ERRORS.ALREADY_EXIST,
                    errMessage: "Email id already exists"
                }
            })
        }

    } catch (error) {
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    }

    let data = {
        name, email, password
    }
    const newUser = new Users({ ...data })

    newUser.save().then((responce) => {
        res.status(201).json({
            message: 'User created successfully',
            payload: responce
        })
    }).catch((err) => {
        console.log('err :>> ', err);
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    })
}

exports.login = async (req, res, next) => {

    const { email, password } = req.body;
    const isE = isEmpty(email, password);
    if (isE)
        return res.status(200).json(isE);

    const user = await Users.findOne({ email: { $regex: email, $options: 'i' } })

    if (!user)
        return res.status(404).json({
            error: {
                errCode: ERRORS.NOT_FOUND,
                errMessage: "User not exists"
            }
        })

    if (user.password != password)
        return res.status(401).json({
            error: {
                errCode: ERRORS.NOT_MATCH,
                errMessage: "Invalid Password"
            }
        })

    return res.status(200).json({
        message: 'User login successfully',
        payload: user
    })
}



exports.getAllUsers = async (req, res, next) => {


    const {
        id,
    } = req.query

    let findQuery = {}
    if (id != '') {
        findQuery = { _id: id }
    }

    try {
        const users = await Users.find(findQuery)

        if (!users)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "Users not exists"
                }
            })

        return res.status(201).json({
            message: 'Users fetch successfully',
            payload: users
        })

    } catch (error) {
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: error
            }
        })
    }
}

exports.getUserData = async (req, res, next) => {
    const {
        id
    } = req.params;
    console.log('req.params', req.params)
    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)

    return await Users.findById(id).then((user) => {
        if (!user)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "User not exists"
                }
            })
        return res.status(201).json({
            message: 'User fetch successfully',
            payload: user
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
exports.updateUsers = async (req, res, next) => {
    const {
        id,
        payload
    } = req.body;

    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)

    return await Users.findByIdAndUpdate(
        id,
        { ...payload },
        { new: true }).then((user) => {
            if (!user)
                return res.status(404).json({
                    error: {
                        errCode: ERRORS.NOT_FOUND,
                        errMessage: "Users not exists"
                    }
                })
            return res.status(201).json({
                message: 'User data updated successfully',
                payload: user
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

