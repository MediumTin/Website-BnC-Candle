// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/delivery_policy',(req,res)=>{
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        res.render('Delivery_Policy',{
            account : `${CurrentUser}`
        });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }
});

Router.get('/payment_policy',(req,res)=>{
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        res.render('Payment_Policy',{
            account : `${CurrentUser}`
        });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }
});

Router.get('/return_policy',(req,res)=>{
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        res.render('Return_Policy',{
            account : `${CurrentUser}`
        });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }
});

Router.get('/privacy_policy',(req,res)=>{
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        res.render('Privacy_Policy',{
            account : `${CurrentUser}`
        });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }
});

// Export router to common usage
module.exports = Router;