const express =require('express');

const {signupUser, loginUser,changePassword, forgotPassword , resetPassword , getProfileDetails , editProfileDetails , deactivateAccount, activateAccount , isInActiveUser } = require('../controllers/userController');

const router = express.Router();

router.post('/login', loginUser);

router.post('/signup', signupUser);

router.post('/changepassword', changePassword);

router.post('/forgotpassword', forgotPassword);

router.post('/resetpassword', resetPassword);

router.post('/getProfileDetails/:email', getProfileDetails);

router.put('/editProfileDetails', editProfileDetails);

router.put('/deactivateAccount/:email', deactivateAccount);

router.put('/activateAccount/:email', activateAccount);

router.post('/isInActiveUser/:email', isInActiveUser);

module.exports = router;