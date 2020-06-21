const mongoose = require('mongoose');
const Schema = mongoose.Schema

const subcribe = new Schema({
    email: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
})


const Subcribe = mongoose.model('subcribe', subcribe)
// module export 
module.exports = Subcribe