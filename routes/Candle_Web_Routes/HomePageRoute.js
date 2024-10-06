// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const expressHb = require('express-handlebars');

const { createClient } = require('redis');

// Process with router
Router.get('/',(req,res)=>{
    var data = "NTT";
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','HomePage.html'));
    res.render('HomePage');
    //Refer to Body 1
    // res.render('HomePage');
})

// Process with some API in Redis
// const client = createClient();  // Create a Redis client
// Router.get('/',async (req,res)=>{
//     await Redis_API.Connect_To_Redis(client);
//     const Result = await Redis_API.Get_Data_From_Redis(client,'homepage');
//     console.log(`Value of requested ${Result}`);
//     res.sendFile(path.join(__dirname,'../','../',Result));
    //    await Redis_API.Disconnect_To_Redis(client);
// })

// Export router to common usage
module.exports = Router;