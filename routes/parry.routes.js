module.exports = app =>{
    const user = require("../controllers/parry.controllers.js");
    const express = require("express");
    const router = express.Router();
    const authMiddleware = require("../helper/jwt")

    router.post('/register',user.register);
    router.post('/login',user.login);
    router.post('/signup',user.signUp);
    router.post('/verifyotp',user.verifyOtp);
    router.post('/forgotpassword',user.forgotPassword);
    router.post('/resetpassword',user.resetPassword);
    router.post('/createSpotFlow',authMiddleware,user.createSpotFlows);
    router.post('/uploadImage',authMiddleware, user.uploadImage);
    router.get('/allFlows', authMiddleware,user.allSpotFlows);  
    router.post('/updateSpotFlow',authMiddleware,user.updateSpotFlow);
    router.delete('/deleteFlow',authMiddleware,user.deleteSpotFlow);
    router.post('/commentFlow',authMiddleware,user.commentFlow);
    router.post('/sub-comment',authMiddleware,user.subComment);
    router.get('/myspot',authMiddleware,user.mySpots);
    router.post('/my-profile',user.myProfile);
    router.post('/updateprofile',user.updateProfile);
    router.get('/allprofile',user.allProfiles);
    router.delete('/deleteprofile',user.deleteProfile);
    router.post('/account',authMiddleware,user.accountSettings);
    router.post('/sendotp',authMiddleware,user.sendOtpCode);
    router.post('/verify-otp', authMiddleware,user.verifyOtpCode);

    app.use("/api", router);
}