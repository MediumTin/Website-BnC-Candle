const express = require('express');
const router = express.Router();
const path = require('path');

// Process when get / or index or index.html
router.get('^/$|index(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','index.html')); // sendFile function to read one file
    // res.send("Hello world") will show the text to page
})

// Process when get new-page or new-page.html
router.get('/new-page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'..','views','new-page.html'));
})

// Process when get old-page or old-page.html
router.get('/old-page(.html)?',(req,res)=>{
    res.redirect(301,'/new-page.html');
})

module.exports = router;