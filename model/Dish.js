const mongoose      = require('mongoose')
const schema        = mongoose.Schema;

var dishSchema =  new schema ({
    name: String,
    price: Number,
    oldprice: Number,
    discount: Number,
    img: String,
    tag: String,
    short_desc: String,
    long_desc: String
})

const dishModel = mongoose.model('Dish', dishSchema);

module.exports = dishModel;
