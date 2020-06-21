const mongoose = require('mongoose');
const Schema = mongoose.Schema

const contact = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    status: {
        type: String,
        default: 'unread'  // read or unread
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    }
})


const Contact = mongoose.model('contact', contact)
// module export 
module.exports = Contact