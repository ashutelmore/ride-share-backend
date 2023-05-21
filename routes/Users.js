var express = require('express');
const { register, login, getAllUsers, updateUserDetails, getUserData, updateUsers, deleteUser, verifyEmail, resendVerification, forgetPassword } = require('../controllers/Users');
var router = express.Router();


/* GET users listing. */
router.post('/register', register)
router.post('/login', login)

router.get('/verify/:email/:token', verifyEmail)
router.post('/resendVerification', resendVerification)
router.post('/forgetPassword', forgetPassword)

router.put('/upadateUserDetails', updateUsers)


router.get('/getUser/:id', getUserData)
router.get('/allUsers?', getAllUsers)
router.delete('/deleteUser/:id?', deleteUser)
//test
module.exports = router;
