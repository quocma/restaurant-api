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
        default: 'P'
    },
    order_items: [
        {
            type: Object,
            required: true,
            default: undefined,
            dish_id: {
                type: mongoose.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
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
        phone: {
            type: String,
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