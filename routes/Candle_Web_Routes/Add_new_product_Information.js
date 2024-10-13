// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');

// Process with router
Router.get('/',(req,res)=>{
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Add_new_product_Information.html'));
        // res.status(200).render('Add_new_product_Information',{
        //     account : `${CurrentUser}`
        // });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }   
})

// Export router to common usage
module.exports = Router;