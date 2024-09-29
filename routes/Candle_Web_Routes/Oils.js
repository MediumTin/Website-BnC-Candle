// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const { createClient } = require('redis');
const client = createClient();  // Create a Redis client

// Process with router
Router.get('/',(req,res)=>{
    // res.sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Oils.html'));
   // res.clearCookie("oils"); // Xoa redundant cookie in JS script
   res.cookie("type","oils",{ expires: new Date(Date.now() + (7*3600000+5000))}).status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
   // res.cookie("type","oils").status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
   // expire time in 10 second
   })

// Use this code if using seperated Redis request
// Router.post('/',async (req,res)=>{
//     // const {user, pwd} = req.body;
//     var Request_From_Client = `${req.body.name}`;
//     console.log(`Post status is received. Message is ${req.body.name}`);
//     if (Request_From_Client == "First_Time_load"){
//        console.log("Request first time load page in Oils handling");
//        await Redis_API.Connect_To_Redis(client); // Open connection to Redis
//        const Oil_Filter = "oil,best_seller,discount,new_arrival,sweet_fruit,wood_men,fresh_relax,flower_herb,lumos,citta,no_brand,smaller_100KVND,100KVND_to_200KVND,200KVND_to_300KVND,300KVND_to_500KVND,larger_500KVND,black,white,red,pink,blue,green,yellow,orange,purple";
//        const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Oil_Filter); // Check request is exist in Cache or not
//        console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
//        if(Result_Read_From_Cache == null){
//           console.log("Miss cached");
//          //  const Data_From_Database = await First_Time_Loading(req,res); // missing in cache , Request read from Database
//           res.status(400).send(Result_Read_From_Cache); // After get data from database and write to Cache, it will response to client
//        }
//        else {
//           console.log("Cached");
//           res.status(200).send(Result_Read_From_Cache); // Available in cache, Read in Cache
//        }
//        await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
//     }
//     else {
//        console.log("Invalid request from client");
//     }
//  })

// Second way: using filter with "Oils" , no seperated Redis request, use Post method in Candles middleware

 const First_Time_Loading = async (req,res) => {
    var result = await Menu_Candle_Processing.GetAllProductInformation();
    console.log("Result of First time loading : ",result);
    return result;
 }

// Export router to common usage
module.exports = Router;