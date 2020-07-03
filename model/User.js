const mongoose = require('mongoose')
const schema =  mongoose.Schema

const userSchema = new schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: String
    },
})

const User = new mongoose.model('user',userSchema);
module.exports = User