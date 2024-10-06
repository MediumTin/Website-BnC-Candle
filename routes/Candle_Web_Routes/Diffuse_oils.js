// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Diffuse_oils.html'));
    res.status(200).render('Search_And_Filtering_Product',{
        Request_From_Header : "diffuse_oils"
     });
})

// Export router to common usage
module.exports = Router;