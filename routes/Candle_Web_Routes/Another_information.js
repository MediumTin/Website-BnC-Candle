// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/delivery_policy',(req,res)=>{
    res.render('Delivery_Policy');
});

Router.get('/payment_policy',(req,res)=>{
    res.render('Payment_Policy');
});

Router.get('/return_policy',(req,res)=>{
    res.render('Return_Policy');
});

Router.get('/privacy_policy',(req,res)=>{
    res.render('Privacy_Policy');
});

// Export router to common usage
module.exports = Router;