// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const { createClient } = require('redis');
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
const User_Information_Handling = require('../../controllers/Website_Candle_Light/User_Information_Handling');
const Global_Interface = require('../../controllers/Website_Candle_Light/Global_interface');
var result = "";
var Shopping_bag_array = []; // declare one array (listed node), can easy for adding new element into it.
var Shopping_bag_array_counter = 0;
// var isFirstTimeLogin = true;
const client = createClient({
   username: 'default',
   password: 'eKmCEByJceBAy8EXlviDdGnvAbgwLWmI',
   socket: {
       host: 'redis-17737.c16.us-east-1-3.ec2.redns.redis-cloud.com',
       port: 17737
   }
});  // Create a Redis client
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
            Shopping_bag_array_counter = 0;
            Shopping_bag_array = [];
            isFirstTimeLogin = true;
            // req.sessionStore.clear((err) =>{
            //    if(err){
            //        return res.send('Error clearing session.');
            //    }
            // })
            req.session.destroy();
            res.redirect('/login_handling');
         }
      }
   }
})

Router.post('/',(req,res)=>{
   console.log(`Post status is received in Candle_information is ${req.body.name}`);
   // console.log(result);
   res.status(200).send(result);
})

Router.post('/requestwriteintosession',(req,res)=>{
   console.log(`Post status is received in requestwriteintosession is ${req.body.candle_name}`);
   
   var local_request_to_write = req.body.candle_name;
   var local_request_quatity = req.body.quatity;
   var local_request_price = req.body.price;
   var local_request_image = req.body.image;
   var isSessionValid = req.session.personal_information; // Check session is exist or not

   // Reset first time after log in
   if(Global_Interface.isFirstTimeLogin == true){
      Shopping_bag_array_counter = 0;
      Shopping_bag_array = [];
   }
   console.log(`Value of first login is ${Global_Interface.isFirstTimeLogin}`);
   if(isSessionValid != undefined){
      // Handle when client still valid
      const LOC_SessionID = req.sessionID; // Get session ID of client for authentication
      var LOC_CurrentSessionDataValid = "";
      Global_Interface.isFirstTimeLogin = false;
      console.log(`Previous value is : ${Shopping_bag_array}`);

      // Get current data of authenticated person
      req.sessionStore.get(LOC_SessionID, async function(err, session) {
         if (err) {
             // Handle the error
             res.send("Not found SID in Redis cache");
         } else {
            // Work with the session
            var CurrentUser = session.personal_information.username;
            console.log("Your first session is",session);
            // Check length of shopping bag in session storage
            var LOC_Length_Of_ShoppingBag_In_Session = session.personal_shopping_bag.length;

            console.log(`Length of shopping bag session ${LOC_Length_Of_ShoppingBag_In_Session}`); // ex: 4
            // Assign new index for add new product into session storage of authenticated person
            Shopping_bag_array_counter = LOC_Length_Of_ShoppingBag_In_Session;
            // Assign data in session storage into local array for update new value
            Shopping_bag_array = (session.personal_shopping_bag);
            console.log(`Shopping_bag_array from session ${Shopping_bag_array}`);
            // Add new product into local array
            Shopping_bag_array[Shopping_bag_array_counter] = [
               `${local_request_to_write}`,
               `${local_request_quatity}`,
               `${local_request_price}`,
               `${local_request_image}`
            ];
            // Assign local array into session storage
            console.log(`Current shopping bag array ${Shopping_bag_array}`);
            console.log(`Current shopping bag array 1 ${Shopping_bag_array[0]}`);
            session.personal_shopping_bag = Shopping_bag_array;
            console.log("Your second session is",session);
            LOC_CurrentSessionDataValid = session;
            
            // 1. Update new value into Database
            User_Information_Handling.Update_Content_of_ShoppingBag(CurrentUser,Shopping_bag_array[Shopping_bag_array_counter]);
            // 2. Delete personal shopping bag from Redis cache
            await Redis_API.Connect_To_Redis(client); // Open connection to Redis
            await Redis_API.Delete_seperated_data_inRedis(client,CurrentUser);
            await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
            // 3. Set new updated value into Redis storage with specific SID of client (other SIDs  will not impact)
            req.sessionStore.set(LOC_SessionID,LOC_CurrentSessionDataValid,function(err) {
               console.log("Your FINAL session is",LOC_CurrentSessionDataValid);
               if (err) {
                  // Handle the error
                  res.send("Error when write session data into Redis");
               } else {
                  // Work with the session
                  console.log("Write session data into Redis sucessfully");
               }
         });
         }
     });
   }
   else {
      // Session is timeout -> Request login again
      // Shopping_bag_array = [];
      Global_Interface.isFirstTimeLogin = true;
      req.sessionStore.clear((err) =>{
         if(err){
             return res.send('Error clearing session.');
         }
     })
     req.session.destroy();
      res.redirect('/login_handling');
   }
   console.log(`Value of Shopping_bag_array_counter is ${Shopping_bag_array_counter} and array is ${Shopping_bag_array}`);
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