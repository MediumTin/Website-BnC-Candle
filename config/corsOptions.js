
// Cross Origin Resource Sharing
const whitelist = [
    'https://www.yourside.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500'
];

const corsOption ={
    origin : (origin,callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) { // 
            callback(null,true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionSuccessStatus : 200
}

module.exports = corsOption;