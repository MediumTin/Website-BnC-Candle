// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Diffuse_oils.html'));
    res.cookie("type","diffuse_oils",{ expires: new Date(Date.now() + (7*3600000+5000))}).status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
})

// Export router to common usage
module.exports = Router;