const mongoose  = require('mongoose')
const Schema    = mongoose.Schema


const orderSchema = {
    amount: {
        type: Number,
        required: true
    },
    delivery_charge: {
        type: Number,
        required: true
    },
    tax: Number,
    status: {
        type: String,
        default: 'A'
    },
    order_items: {
        type: Array,
        required: true,
        default: undefined
    }
    ,
    custom_info: {
        name: {
            type: String,
            required: true
        },
        mail: {
            type: String,
            required: true
        },
        Phone: {
            type: Number,
            required: true
        },
        addr: {
            type: String,
            required: true
        },
        note: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
}

const Order = mongoose.model('Order', orderSchema)

module.exports = Order;