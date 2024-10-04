// Declare library and dependent module
const express = require('express');
const Router = express.Router();
const path = require('path');

// Process with router
Router.get('/',(req,res)=>{
    res.render('Contact');
})

// Export router to common usage
module.exports = Router;