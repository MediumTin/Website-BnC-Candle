// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Care_candles.html'));
    res.cookie("type","care_candles",{ expires: new Date(Date.now() + (7*3600000+5000))}).status(200).render('Search_And_Filtering_Product');
})

// Export router to common usage
module.exports = Router;