const { ERRORS } = require("../helper/constants");
const { isEmpty, isInalidMongoDBid } = require("../helper/helper");
const Users = require("../models/Users")
const jwt = require('jsonwebtoken');
const JWT_KEY_MAIL = process.env.JWT_KEY_MAIL
const FRONTEND_END_POINT = process.env.FRONTEND_END_POINT
const SENDER_GMAIL = process.env.SENDER_GMAIL

const transporter = require('../middlewares/SendMail')



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
        console.log('error', error)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "Something went wrong"
            }
        })
    }

    const token = jwt.sign({
        data: `Token Data`,
    }, JWT_KEY_MAIL,
        { expiresIn: '10m' }
    );

    try {
        let info = await transporter.sendMail({
            from: `EzyRidez ${SENDER_GMAIL}`, // sender address
            to: `${email}`, // list of receivers
            subject: "Hello ✔", // Subject line
            text: `Hi! There, You have recently visited 
            our website and entered your email.
            Please follow the given link to verify your email
            ${FRONTEND_END_POINT}/${email}/${token} 
            Thanks`, // html body
        });


    } catch (error) {
        console.log('error', error)
        return res.status(500).json({
            error: {
                errCode: ERRORS.SOMETHING_WRONG,
                errMessage: "We are facing some issue to send verification mail. Please contact support"
            }
        })
    }


    let data = {
        name, email, password
    }
    const newUser = new Users({ ...data })

    return newUser.save().then((responce) => {
        return res.status(201).json({
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
exports.resendVerification = async (req, res, next) => {
    const { name, email, } = req.body;

    console.log('req.body', req.body)
    const isE = isEmpty(name, email);
    if (isE)
        return res.status(200).json(isE);

    try {
        const user = await Users.findOne({ email: email })
        if (!user)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "User not exists"
                }
            })
        if (user) {
            const token = jwt.sign({
                data: `Token Data`,
            }, JWT_KEY_MAIL,
                { expiresIn: '10m' }
            );

            try {
                let info = await transporter.sendMail({
                    from: `EzyRidez ${SENDER_GMAIL}`, // sender address
                    to: `${email}`, // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: `Hi! There, You have recently visited 
                    our website and entered your email.
                    Please follow the given link to verify your email
                    ${FRONTEND_END_POINT}/${email}/${token} 
                    Thanks`, // html body
                });
                return res.status(201).json({
                    message: 'Verification mail sended successfully',
                    payload: user
                })

            } catch (error) {
                console.log('error', error)
                return res.status(500).json({
                    error: {
                        errCode: ERRORS.SOMETHING_WRONG,
                        errMessage: "We are facing some issue to send verification mail. Please contact support"
                    }
                })
            }
        }

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
exports.forgetPassword = async (req, res, next) => {
    const { email, } = req.body;

    console.log('req.body', req.body)
    const isE = isEmpty(email);
    if (isE)
        return res.status(200).json(isE);

    try {
        const user = await Users.findOne({ email: { $regex: email, $options: 'i' } })
        if (!user)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "User does not exist"
                }
            })
        if (user) {

            try {
                let info = await transporter.sendMail({
                    from: `EzyRidez ${SENDER_GMAIL}`, // sender address
                    to: `${email}`, // list of receivers
                    subject: "Hello ✔", // Subject line
                    html: `Hi! There, Here is your credential
                    <b>Email : </b> ${user.email} 
                    <b>Password : </b> ${user.password} 
                    Thanks`, // html body
                });
                return res.status(201).json({
                    message: 'Password mail sended successfully',
                    payload: {}
                })

            } catch (error) {
                console.log('error', error)
                return res.status(500).json({
                    error: {
                        errCode: ERRORS.SOMETHING_WRONG,
                        errMessage: "We are facing some issue to send verification mail. Please contact support"
                    }
                })
            }
        }

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

exports.verifyEmail = async (req, res) => {
    const { token, email } = req.params;

    // Verifying the JWT token 
    console.log('req.params', req.params)
    jwt.verify(token, JWT_KEY_MAIL, async function (err, decoded) {
        if (err) {
            console.log(err);
            return res.status(404).json({
                error: {
                    errCode: ERRORS.SOMETHING_WRONG,
                    errMessage: "Email verification failed, possibly the link is invalid or expired"
                }
            })
        }
        else {
            const user = await Users.findOne({ email: { $regex: email, $options: 'i' } })
            const data = {
                ...user._doc,
                isVerified: true
            }

            if (!user)
                return res.status(404).json({
                    error: {
                        errCode: ERRORS.NOT_FOUND,
                        errMessage: "User not exists"
                    }
                })

            if (user.isVerified)
                return res.status(201).json({
                    message: 'Already verified',
                    payload: user
                })

            console.log('data', data)
            console.log('user', user)
            return await Users.findByIdAndUpdate(
                data._id,
                { ...data },
                { new: true }).then((user) => {
                    console.log('user', user)
                    if (!user)
                        return res.status(404).json({
                            error: {
                                errCode: ERRORS.NOT_FOUND,
                                errMessage: "User does not exists or possibly the link is invalid or expired"
                            }
                        })
                    return res.status(201).json({
                        message: 'Your Email verifyed successfully',
                        payload: data
                    })

                }).catch((err) => {
                    console.log(err)
                    return res.status(404).json({
                        error: {
                            errCode: ERRORS.SOMETHING_WRONG,
                            errMessage: "Something went wrong"
                        }
                    })
                })
        }
    });
};

exports.getAllUsers = async (req, res, next) => {


    const id = req.query.id || '';

    let findQuery = {}
    if (id != '') {
        findQuery = { _id: id }
    }
    console.log('findQuery', findQuery)
    try {
        const users = await Users.find(findQuery).sort({ updatedAt: -1 })

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

    console.log('req.body', req.body)

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
            console.log(err)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.SOMETHING_WRONG,
                    errMessage: "Something went wrong"
                }
            })
        })
}

exports.deleteUser = async (req, res, next) => {
    const {
        id
    } = req.params;

    const isE = isEmpty(id);
    if (isE)
        return res.status(200).json(isE);

    const isinvalidId = isInalidMongoDBid(id)
    if (isinvalidId)
        return res.status(200).json(isinvalidId)


    return await Users.deleteOne({
        _id: id
    }).then(async (data) => {
        console.log('data', data)
        if (!data)
            return res.status(404).json({
                error: {
                    errCode: ERRORS.NOT_FOUND,
                    errMessage: "User does not exists"
                }
            })
        return res.status(201).json({
            message: 'User data deleted successfully',
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
