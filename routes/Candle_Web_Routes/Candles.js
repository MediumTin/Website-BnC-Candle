// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
var isAdminRightChecked;
const Redis_API = require('../../controllers/API_with_Redis/API_Redis');
const { createClient } = require('redis');
const samplearray2 = ['Location 1', 'Location 2'];

const client = createClient();  // Create a Redis client

Router.post('/',async (req,res)=>{
   // const {user, pwd} = req.body;
   var Request_From_Client = `${req.body.name}`;
   console.log(`Post status is received. Message is ${req.body.name}`);
   if (Request_From_Client == "First_Time_load"){
      console.log("Request first time load page");
      await Redis_API.Connect_To_Redis(client); // Open connection to Redis
      const Result_Read_From_Cache = await Redis_API.Get_Data_From_Redis(client,Request_From_Client); // Check request is exist in Cache or not
      console.log(`Value of reading data from Cache: ${Result_Read_From_Cache}`); 
      if(Result_Read_From_Cache == null){
         console.log("Miss cached");
         const Data_From_Database = await First_Time_Loading(req,res); // missing in cache , Request read from Database
         const Result_Write_To_Cache = await Set_Data_From_Database_To_RedisCache(Request_From_Client,JSON.stringify(Data_From_Database)); // set new data from database to Redis cache
         console.log(`Value of writing data to Cache: ${Result_Write_To_Cache}`);
         res.status(200).send(Data_From_Database); // After get data from database and write to Cache, it will response to client
      }
      else {
         console.log("Cached");
         res.status(200).send(Result_Read_From_Cache); // Available in cache, Read in Cache
      }
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
   }
   else if (Request_From_Client == "Request_Filter_Product"){
      console.log("Request filter product");
      // Prepare some use cases for cache as : candle, oil, best_seller, discount (simple request - statement)
      await Redis_API.Connect_To_Redis(client); // Open connection to Redis
      var Total_Request_Filter_Product = `${req.body.Request_Of_Type},${req.body.Request_Of_Group},${req.body.Request_Of_Brand},${req.body.Request_Of_Price},${req.body.Request_Of_Color}`;
      console.log(`Total Request type : ------ ${Total_Request_Filter_Product}`);
      const Result_Read_From_Cache_FilterProduct = await Redis_API.Get_Data_From_Redis(client,Total_Request_Filter_Product); 
      console.log(`Value of reading data from Cache: ${Result_Read_From_Cache_FilterProduct}`); 
      if(Result_Read_From_Cache_FilterProduct == null){
         console.log("Filter product miss cached");
         const Data_From_Database_FilterProduct = await Request_Filter_Product(req,res); // user for complicated request (multiple conditions)
         const Result_Write_To_Cache_FilterProduct = await Set_Data_From_Database_To_RedisCache(Total_Request_Filter_Product,JSON.stringify(Data_From_Database_FilterProduct)); // set new data from database to Redis cache
         console.log(`Value of writing data to Cache: ${Result_Write_To_Cache_FilterProduct}`);
         res.status(200).send(Data_From_Database_FilterProduct);
      } else {
         console.log("Filter product cached");
         res.status(200).send(Result_Read_From_Cache_FilterProduct); // Available in cache, Read in Cache
      }
      await Redis_API.Disconnect_To_Redis(client); // Close connection to Redis
   }
   else {
      console.log("Invalid request from client");
   }
})

Router.post('/addnewproduct',async (req,res)=>{
   // Startdard way:
   // 1. Set new value in Database
   // 2. Delete from Cache
   // 3. Read cache failure (miss cached)
   // 4. Read data from Datbase due to missing Cache
   // 5. Write new data to Cache
   Request_Add_New_Product(req,res);
   await Redis_API.Connect_To_Redis(client); // Open connection to Redis
   await Redis_API.Delete_Data_In_Redis(client);
   await Redis_API.Disconnect_To_Redis(client);
   
   // res.status(200).send(samplearray);
})
// Process with router
Router.get('/',(req,res)=>{
   isAdminRightChecked = 0;
   //  res.cookie("type","candles",{ expires: new Date(Date.now() + (7*3600000+5000)) }).status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product.html'));
   res.cookie("type","candles",{ expires: new Date(Date.now() + (7*3600000+5000)) }).status(200).render('Search_And_Filtering_Product');
})

// Process with router
Router.get('/adminright',(req,res)=>{
   isAdminRightChecked = 1;
   // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','Search_And_Filtering_Product_AdminRight.html'));
   res.status(200).render('Search_And_Filtering_Product_AdminRight');
  //  res.send({ samplearray2 }); // Return data as JSON
   
})

const Set_Data_From_Database_To_RedisCache = async (key,data) => {
   const Result_Of_Update_DB = await Redis_API.Set_Data_To_Redis(client,key,data);
   return Result_Of_Update_DB;
}

const First_Time_Loading = async (req,res) => {
   var result = await Menu_Candle_Processing.GetAllProductInformation();
   console.log("Result of First time loading : ",result);
   return result;
}

const Request_Filter_Product = async (req,res) => {
   var Request_Filter_type = req.body.Request_Of_Type;
   var Request_Filter_group = req.body.Request_Of_Group;
   var Request_Filter_brand = req.body.Request_Of_Brand;
   var Request_Filter_price = req.body.Request_Of_Price;
   var Request_Filter_color = req.body.Request_Of_Color;
   var Result_Filtered_Data = await Menu_Candle_Processing.FilterInfo(Request_Filter_type,Request_Filter_group,Request_Filter_brand,Request_Filter_price,Request_Filter_color);
   return Result_Filtered_Data;
   // console.log(`Check duplicate: ${Result_Filtered_Data}`); // Expectation: Return in object type
   // console.log(`Request of A is ${Request_Filter_type}`);
   // console.log(`Request of B is ${Request_Filter_group}`);
   // console.log(`Request of C is ${Request_Filter_brand}`);
   // console.log(`Request of D is ${Request_Filter_price}`);
   // console.log(`Request of E is ${Request_Filter_color}`);
}

const Request_Add_New_Product = async (req,res) => {
   var Request_Add_Name = req.body.productname;
   var Request_Add_Type = req.body.producttype;
   var Request_Add_Group = req.body.productgroup;
   var Request_Add_Brand = req.body.productbrand;
   var Request_Add_Price = req.body.productprice;
   var Request_Add_Price_Range = req.body.productpricerange;
   var Request_Add_Color = req.body.productcolor;
   var Request_Add_Image = req.body.productimage;
 
   var result = await Menu_Candle_Processing.AddNewProductInformation(
      Request_Add_Name,
      Request_Add_Type,
      Request_Add_Group,
      Request_Add_Brand,
      Request_Add_Price,
      Request_Add_Price_Range,
      Request_Add_Color,
      Request_Add_Image
   );
   console.log("Result of Add new product : ",result);
   if(result==1){
      // Add successfully
      res.status(200).redirect('/candles/adminright');
   } else {
      // Add failure
      res.status(200).redirect('/Add_new_product');
   }
   

}
// Export router to common usage
module.exports = Router;