// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Natural_oils.html'));
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        var CurrentUser = req.session.personal_information.username;
        res.render('Search_And_Filtering_Product',{
            Request_From_Header : "natural_oils",
            account : `${CurrentUser}`
        });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }
})

// Export router to common usage
module.exports = Router;