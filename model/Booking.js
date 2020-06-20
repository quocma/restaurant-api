const mongoose = require('mongoose');
const Schema = mongoose.Schema

const booking = new Schema({
    name : {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String
    }
    ,
    guest: {
        type: Number
    },
    phone: {
        type : String,
        required: true
    },
    note: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
})


const Booking = mongoose.model('booking', booking)
// module export 
module.exports = Booking