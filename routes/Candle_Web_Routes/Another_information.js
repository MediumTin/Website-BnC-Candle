// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/delivery_policy',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Delivery_Policy.html'));
});

Router.get('/payment_policy',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Payment_Policy.html'));
});

Router.get('/return_policy',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Return_Policy.html'));
});

Router.get('/privacy_policy',(req,res)=>{
    res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Privacy_Policy.html'));
});

// Export router to common usage
module.exports = Router;