const express =require('express');

const {signupUser, loginUser,changePassword, forgotPassword , resetPassword , getProfileDetails , editProfileDetails , deactivateAccount, activateAccount , isInActiveUser } = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.post('/changepassword', changePassword);

router.post('/forgotpassword', forgotPassword);

router.post('/resetpassword', resetPassword);

router.get('/getProfileDetails', getProfileDetails);

router.put('/editProfileDetails', editProfileDetails);

router.put('/deactivateAccount', deactivateAccount);

router.put('/activateAccount', activateAccount);

router.post('/isInActiveUser', isInActiveUser);

module.exports = router;