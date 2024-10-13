// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const { createClient } = require('redis');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
var result = "";

const client = createClient();  // Create a Redis client
// New implementation for Engine template handlerbar

Router.get('^/$|',async (req,res)=>{
   // Get all product information in Cache (If Cache available) and in Database (If Cache unavailable)
   var listofcandle = await ReadAllData_From_Database_And_RedisCache();
   // console.log("Result offf",typeof(listofcandle));
   var lengthofcandle = listofcandle.length;
   let temp = "";
   let temp1 ="";
   for(let i = 0; i<lengthofcandle; i++){
      temp = listofcandle[i].name;
      temp = temp.replaceAll(" ","_");
      temp1 = `${"/"+temp}`;
      // console.log(`tempt is ${temp1}`);
      // console.log(`req.url is ${req.url}`);
      if(req.url == temp1){
         result = listofcandle[i]; // send the selected candle information to html page
         // console.log("Matching");
         // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','General_Detail_Information.html'));
         var isSessionValid = req.session.personal_information; // Check session is exist or not
         if(isSessionValid != undefined){
            var CurrentUser = req.session.personal_information.username;
            res.status(200).render('General_Detail_Information',{
               account : `${CurrentUser}`
            })}
         else {
            // Session is timeout -> Request login again
            res.redirect('/login_handling');
         }
      }
   }
})

Router.post('/',(req,res)=>{
   console.log(`Post status is received. Message is ${req.body.name}`);
   // console.log(result);
   res.status(200).send(result);
})

const ReadAllData_From_Database_And_RedisCache = async() =>{
   await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,'First_Time_load'); // Check request is exist in Cache or not
   // console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
   if(Result_Read_From_Cache == null){
      console.log("Miss cached");
      var listofcandle = await Menu_Candle_Processing.GetAllProductInformation(); // Read data from Database
      const Result_Write_To_Cache = await Redis_API.Set_Data_To_Redis(client, 'First_Time_load',JSON.stringify(listofcandle)); 
      // console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
   }
   else {
      console.log("Cached");
      var listofcandle = JSON.parse(Result_Read_From_Cache); // Read data from Cache and convert data from string to JSON object
   }
   await Redis_API.Disconnect_To_Redis(client);
   return listofcandle;
}
// Export router to common usage
module.exports = Router;