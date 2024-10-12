// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const expressHb = require('express-handlebars');
const cookieParser = require('cookie-parser');
// // Declare liberies for express-session
// const session = require('express-session');
// const Redis = require('ioredis');
// const RedisStore = require('connect-redis').default;
// const clientRedis = new Redis(); // defaut localhost
// const TargetTime_Of_Minute = 1;
// var TargetTime_Of_Milisecond = TargetTime_Of_Minute*60*1000;

const { createClient } = require('redis');
// Router.use(cookieParser());
// Process with router
Router.get('/',(req,res)=>{
    var data = "NTT";
    // console.log(`REQUEST COOKIE IS ${req.cookies}`);
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','HomePage.html'));
    var isSessionValid = req.session.personal_information; // Check session is exist or not
    if(isSessionValid != undefined){
        // Session is normal - Keep current HTML page
        var CurrentUser = req.session.personal_information.username;
        res.render('HomePage',{
            account : `${CurrentUser}`
        });
    } else {
        // Session is timeout -> Request login again
        res.redirect('/login_handling');
    }
 
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