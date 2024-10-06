// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    // res.cookie("type","accessories",{ expires: new Date(Date.now() + (7*3600000+5000))}).status(200).render('Search_And_Filtering_Product');
    res.status(200).render('Search_And_Filtering_Product',{
        Request_From_Header : "accessories"
    });
})

// Export router to common usage
module.exports = Router;