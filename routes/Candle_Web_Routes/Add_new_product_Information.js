// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');

// Process with router
Router.get('/',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Add_new_product_Information.html'));
    // res.status(200).render('Add_new_product_Information');
   //  res.send({ samplearray2 }); // Return data as JSON
    
})

// Export router to common usage
module.exports = Router;