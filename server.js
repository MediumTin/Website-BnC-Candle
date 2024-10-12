require('dotenv').config();
const redis = require('redis');
const USER_NAME = 'username';
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions.js')
const {logger} = require('./middleware/logEvents'); 
const errorHandler = require('./middleware/errorHandler'); 
const verifyJWT = require('./middleware/verifyJWT.js');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn.js');
const expressHb = require('express-handlebars');
const session = require('express-session');
const Redis = require('ioredis');
const RedisStore = require('connect-redis').default;
const clientRedis = new Redis(); // defaut localhost
// import { engine } from 'express-handlebars';
const PORT = process.env.PORT || 3500;
const RedisPort = PORT;
const TargetTime_Of_Minute = 1;
var TargetTime_Of_Milisecond = TargetTime_Of_Minute*60*1000;

// Example using session middleware
app.use(session({
    secret : 'mediumtin',
    store : new RedisStore({client: clientRedis}), // Store SID or session of user into Redis cache
    resave : false,
    saveUninitialized: true, // Properties for re-create Cookies and send to Client
    cookie : {
        secure: false,
        httpOnly: true, // allow client can know document.cookie or not
        // expires: (new Date(Date.now() + TargetTime_Of_Milisecond + 7*60*60*1000)),
        maxAge : TargetTime_Of_Milisecond // 1 minute
    }
}))

// to connect express to handlbar
app.engine('handlebars', expressHb.engine());
app.set('view engine', 'handlebars');
// app.set('views', './views/Example_Express_Handlebar');
app.set('views', './views/Candle_Web_Routes');

const client = redis.createClient();
// client.connect();

// Connect to MongoDB
connectDB();

//---------------------------------------Common Middleware declaration---------------------------------------//
// 1.1. Custom middleware logger
app.use(logger);
// 1.2. Build-in middleware to share origin resource to other Routes
app.use(cors(corsOptions));
// 1.3. Build-in middleware to convert incomming request to parsed data
app.use(express.urlencoded({extended:false}));
// 1.4. Build-in middleware to convert parsed data to JSON data
app.use(express.json());
// 1.5. Build-in middleware to convert incommong cookies to req.cookie object in express JS
app.use(cookieParser());
// 1.6. Built-in middleware to serve static files to all routes (if needed, can give permission only some specific routes)
app.use(express.static(path.join(__dirname,'/public')));   

//---------------------------------------Common Route declaration-------------------------------------------//
console.log("Program is running ----------");
// // Example
// app.use('/',require('./routes/root'));
// app.use('/subdir',require('./routes/subdir'));
// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth')); 
// app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));


app.use('/',require('./routes/Candle_Web_Routes/HomePageRoute'));
// app.get('/',(req,res)=>{
//     console.log(`REQUEST COOKIE IS ${req.cookies}`);
// })

// // example about express session
app.get('/get-session', (req,res)=>{
    res.send(req.session); // req.session.user.username
    console.log(`Cookie is ${req.cookie}`); // req.session.cookie.maxAge
    // Session will have 2 part : 1 is Cookie info and 2,3,4,... is data
})

app.use('/candles',require('./routes/Candle_Web_Routes/Candles'));
// app.get('/candles', (req, res) => {
//     const data = ['Location 1', 'Location 2']; // Your data here
//     res.send({ data }); // Return data as JSON
//   });
app.use('/oils',require('./routes/Candle_Web_Routes/Oils'));
app.use('/diffuse_oils',require('./routes/Candle_Web_Routes/Diffuse_oils'));
app.use('/natural_oils',require('./routes/Candle_Web_Routes/Natural_oils'));
app.use('/accessory',require('./routes/Candle_Web_Routes/Accessory'));
app.use('/burn_candles',require('./routes/Candle_Web_Routes/Burn_candles'));
app.use('/care_candles',require('./routes/Candle_Web_Routes/Care_candles'));
app.use('/gift',require('./routes/Candle_Web_Routes/Gift'));
app.use('/news',require('./routes/Candle_Web_Routes/News'));
app.use('/contact',require('./routes/Candle_Web_Routes/Contact'));
app.use('/another_information',require('./routes/Candle_Web_Routes/Another_information'));

// Detail product information
app.use('/candle_information',require('./routes/Candle_Information/Candle_Information'));

// Login handling
app.use('/login_handling',require('./routes/Candle_Information/Login_Web_Page'));

// Add new product information - ONly applicable for Admin account
app.use('/Add_new_product',require('./routes/Candle_Web_Routes/Add_new_product_Information'));

//---------------------------------------Specific Route and Middleware declaration--------------------------//
// Specific Custom Middleware to check authorization and get Json Web Token to make private action. Before this line, it will not require JWToken to execute
// app.use(verifyJWT);
// After this line, it will require JWToken branded to execute - After login and grant, will allow get data
app.use('/employees',require('./routes/api/employees')); //example create one API



//---------------------------------------Error recognition and connection declaration-----------------------//
// 1.7. Custom Middleware for logging error request/response between server and client
app.use(errorHandler);

// Method is used to start a web server and listen for connections on a specified host and port
mongoose.connection.once('open',()=>{
    console.log('Connected to MongooseDB');
    app.listen(PORT, ()=> console.log(`Server is running on Port: ${PORT}`));  
})

// app.listen(PORT, ()=> console.log(`Server is running on Port: ${PORT}`)); 

// New implementation




