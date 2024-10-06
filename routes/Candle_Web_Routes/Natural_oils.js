// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Natural_oils.html'));
    res.render('Search_And_Filtering_Product',{
        Request_From_Header : "natural_oils"
     });
})

// Export router to common usage
module.exports = Router;