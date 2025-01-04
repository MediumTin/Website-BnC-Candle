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
const nodemailer = require('nodemailer'); // declare for mail service
var cryp = require('crypto');
const Redis = require('ioredis');
const { v4: uuidv4 } = require("uuid");
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const clientRedis = new Redis({
    port: 17737,          // Redis port
    host: 'redis-17737.c16.us-east-1-3.ec2.redns.redis-cloud.com',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    password: 'eKmCEByJceBAy8EXlviDdGnvAbgwLWmI',
    db: 0
}); // defaut localhost
// let clientRedis = redis.createClient();

// const clientRedis  = redis.createClient({
//     username: 'default',
//     password: 'eKmCEByJceBAy8EXlviDdGnvAbgwLWmI',
//     socket: {
//         host: 'redis-17737.c16.us-east-1-3.ec2.redns.redis-cloud.com',
//         port: 17737
//     }
// });


// import { engine } from 'express-handlebars';
const PORT = process.env.PORT || 3500;
const RedisPort = PORT;
const TargetTime_Of_Minute = 20; // allow in 10 minute
var TargetTime_Of_Milisecond = TargetTime_Of_Minute*60*1000;

// const TestHa = async () =>{
//     await client.connect();
//     await client.set('foo4', 'bar');
//     const result = await client.get('foo');
//     console.log(result)  // >>> bar
// }
// Example using session middleware
app.use(session({
    genid: function(req) {
        return uuidv4(); // use UUIDs for session IDs
      },
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

// const client = redis.createClient();
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
app.get('/test', (req,res)=>{
    TestHa();
    res.send("OK");
})
//---------------------------------------Common Route declaration-------------------------------------------//
console.log("Program is running ----------");
// // Example
// app.use('/',require('./routes/root'));
// app.use('/subdir',require('./routes/subdir'));
// app.use('/register', require('./routes/register'));
// app.use('/auth', require('./routes/auth')); 
// app.use('/refresh', require('./routes/refresh'));
// app.use('/logout', require('./routes/logout'));

// HTML email template
const htmlEmail = `
    <html>
    <body>
        <h1>Welcome to Our Service!</h1>
        <p>Thank you for signing up. We're thrilled to have you on board.</p>
        <table><tr><th><img style="height:5px ;width: 5px;" src="3_Day_WKND.jpg" alt="Our Logo" /></th><th><img style="height:5px ;width: 5
        px;"  src="3_Day_WKND.jpg" alt="Our Logo" /></th></tr></table>
    </body>
    </html>
`;

app.get('/set-email',(req,res)=>{
    mailTransport.sendMail({
        from: '"NenThomBnC" <nenthombnc@gmail.com>',
        to: 'Tin.NguyenTrung3@vn.bosch.com',
        subject: 'Order confirmation',
        //text: 'Thank you for choosing our product. Your product will come to you soon! ',
        html: htmlEmail,
        attachments: [{
            filename: '3_Day_WKND.jpg',
            path: '3_Day_WKND.jpg',
            cid: '3_Day_WKND.jpg' //same cid value as in the html img src
        }],
        generateTextFromHtml: true,
        }, function(err){
        if(err) console.error( 'Unable to send email: ' + err );
        });
    res.send("Sent to email!");
})

// app.get('/set-email', (req,res)=>{
//     res.send(req.session); // req.session.user.username
//     console.log(`Cookie is ${req.cookie}`); // req.session.cookie.maxAge
//     // Session will have 2 part : 1 is Cookie info and 2,3,4,... is data
// })

// Example using JWT without libraries
// 1. Set new JWT mechanism
app.get('set-JWT-Example',(req,res)=>{
    const header = {
        alg : "HS256",
        typ : "JWT"
    }
    
    const payload = {
        sub : "Trung Tin",
        exp : Date.now() + 3600000
    }
    
    //node crypsto generation jwt secret
    //  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
    const JWTsecret = "c682737f1b9d1435c923a963e402f41059ecacdcd393aae69244ef3bb9bf514d";
    
    const EncodedHeader = btoa(JSON.stringify(header));
    const EncodedPayload = btoa(JSON.stringify(payload));
    const tokenData = `${EncodedHeader}.${EncodedPayload}`;
    const hmac = cryp.createHmac("sha256",JWTsecret); // sử dụng thuật toán băm secret key , base64 có thể mã hóa/giải mã nhưng băm sẽ ko thể giải mã được
    const signature = hmac.update(tokenData).digest('base64url'); // Generate signature based on Header and Payload
    res.json({
        token : `${tokenData}.${signature}`,
    })
})

// 2. Get and verify JWT
app.get('/get-JWT', (req,res)=>{
    const token = req.headers.authorization.slice(7);
    if(!token){
        return res.status(401).json({
            message : "Unauthorized!"
        })
    }
    const [encodedHeader, encodedPayload, EncodedSignature] = token.split("."); // seperate from header requested by client
    const tokenData = `${encodedHeader}.${encodedPayload}`;
    const hmac = cryp.createHmac("sha256",JWTsecret); // hash string (combined Header and Payload from client) for comparison with signature key
    const signature = hmac.update(tokenData).digest("base64url");
    if(signature === EncodedSignature){
        // do something when signature is correctly
    }
    res.json(null)
})


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

app.get('/get-sid', (req,res)=>{
    console.log(`Cookie is ${req.headers.cookie}`); // req.session.cookie.maxAge
    req.sessionStore.get(req.sessionID, function(err, session) {
        if (err) {
            // Handle the error
            res.send("Not found SID in Redis cache");
        } else {
            // Work with the session
            res.send(`Found in Redis with Session ID is ${req.sessionID}\n and content is ${session.personal_information.username}`);

        }
    });
    // Session will have 2 part : 1 is Cookie info and 2,3,4,... is data
})


app.get('/clear-sid', (req,res)=>{
    req.sessionStore.clear((err) =>{
        if(err){
            return res.send('Error clearing session.');
        }
    })
    res.send("OK")
})

app.get('/destroy-sid', (req,res)=>{
    req.sessionStore.destroy(req.sessionID,(err) =>{
        if(err){
            return res.send('Error clearing session.');
        }
    })
    res.send("OK")
})

app.get('/destroy-session', (req,res)=>{
    req.session.destroy();
    // res.send(req.session); // req.session.user.username
    console.log(`Destroyed is ${req.session}`); // req.session.cookie.maxAge
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
app.use('/candle_information',require('./routes/Candle_Web_Routes/Candle_Information'));

// Login handling
app.use('/login_handling',require('./routes/Candle_Web_Routes/Login_Web_Page'));

// Add new product information - ONly applicable for Admin account
app.use('/Add_new_product',require('./routes/Candle_Web_Routes/Add_new_product_Information'));

// Payment handling
app.use('/payment_handling',require('./routes/Candle_Web_Routes/Payment_Handling'));

// Shopping bag handling
app.use('/Shopping_Bag_handling',require('./routes/Candle_Web_Routes/Shopping_Bag_Handling'));

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



