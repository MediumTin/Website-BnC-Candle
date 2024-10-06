// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const Menu_Candle_Processing = require('../../controllers/Website_Candle_Light/Menu_Candle_Processing_MongooseDB');
const User_Information_Handling = require('../../controllers/Website_Candle_Light/User_Information_Handling');
// var result = "";

const sessions = {};
Router.get('^/$|',(req,res)=>{
   res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Detail_Product','Boostrap_Login_Form.html'));
})

// Handle login action
Router.post('/login',(req,res)=>{
   console.log(`Login information is received with POST method.`);
   console.log(`Username is ${req.body.username}`);
   console.log(`Password is ${req.body.password}`);
   console.log(`Remember option is ${req.body.remember}`);
   LoginHandling(req, res);
})

// Hangle register action
Router.post('/register',(req,res)=>{
   console.log(`Register information is received with POST method.`);
   console.log(`Username is ${req.body.username}`);
   console.log(`Email is ${req.body.email}`);
   console.log(`Password is ${req.body.password}`);
   console.log(`Confirm-password is ${req.body.confirm_password}`);
   RegisterHandling(req,res);
   
})


const LoginHandling = async(req,res) => {
   var [isValidUser, isAdminRight] = await User_Information_Handling.Check_Valid_User_in_Database(req.body.username, req.body.password);
   console.log(`isValidUser is ${isValidUser}`);
   var CurrentUser = req.body.username;
   if(isAdminRight){
      res.render('Search_And_Filtering_Product_AdminRight',{
         account : `${CurrentUser}`
      });
   } else if (isValidUser) { 
      const sessionId = Date.now().toString();
      sessions[sessionId] = {
         userId: req.body.username,
      };
      // console.log(`Session ID is : ${sessions}`);
      console.log(sessions);  
      res.setHeader('Set-Cookie',`sessionId=${sessionId}; max-age=3600;httpOnly`).redirect('/'); // sent sessionID and redirect to Home Page
      // res.render('Search_And_Filtering_Product',{
      //    account : `${CurrentUser}`
      // });
      // res.redirect('/candles');
   } else {
      // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Detail_Product','Boostrap_Login_Form.html'));
      res.redirect('/login_handling');
   }
}


const RegisterHandling = async(req,res) => {
   var isAddUserValid = await User_Information_Handling.Add_New_User_Information(req.body.username, req.body.email, req.body.password, req.body.confirm_password);
   console.log(`isAddUserValid is ${isAddUserValid}`);
   if(isAddUserValid){
      // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Web_Routes','HomePage.html'));
      res.redirect('/');
   } else {
      // res.status(200).sendFile(path.join(__dirname,'../','../','views','Candle_Detail_Product','Boostrap_Login_Form.html'));
      res.redirect('/login_handling');
   }
}

// Export router to common usage
module.exports = Router;