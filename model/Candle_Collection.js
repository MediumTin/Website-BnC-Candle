const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const candle_Collection = new Schema({
    id : {
        type: Number,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    type : {
        type: String,
        required: true
    },
    group : {
        type: String,
        required: true
    },
    brand : {
        type: String,
        required: true
    },
    price : {
        type: String,
        required: true
    },
    price_range : {
        type: String,
        required: true
    },
    color : {
        type: String,
        required: true
    },
    image : {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Candle_Collection',candle_Collection);