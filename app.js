// defined dependences
const express   = require('express')
const path      = require('path')
const bodyPaser = require('body-parser')
const logger    = require('morgan')
const dishRouter = require('./routes/dishs')
const orderRouter = require('./routes/orders')
const MongoClient  = require('mongoose')



// init express 
const app = express()
// parse application/x-www-form-urlendcode
app.use(bodyPaser.urlencoded({extended: false}))

// parse Json 
app.use(bodyPaser.json({
    // option for json req here!
}));

// connect mongodb from mongoose 
MongoClient.connect('mongodb+srv://quocma:q6v%26FVVpCPFCS%2As@cluster0-tzkjb.mongodb.net/luxuryrestaurant?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
        .then( () => {
            console.log('Connected to Mongodb Atlas from Mongoose')
        })
        .catch( e => {
            console.log('Connect to mongodb fail Error here >>> '+ e);
        })


// logger 
app.use(logger('dev'));

// Routes
app.use('/dish', dishRouter)
app.use('/order', orderRouter)


// Error handle 
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
}) 

// Error handle
app.use((req, res, nex) => {
    const error = err || {}
    const status = err.status || 500
    return res.status(status).json({
            error : {
                message  : error
            }
        })
    
})


const port = 3003
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})