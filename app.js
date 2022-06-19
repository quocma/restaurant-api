// defined dependences
const express   = require('express')
const path      = require('path')
const bodyPaser = require('body-parser')
const logger    = require('morgan')
const dishRouter = require('./routes/dishs')
const orderRouter = require('./routes/orders')
const bookingRouter = require('./routes/bookings')
const subcribeRouter = require('./routes/subcribe')
const userRouter = require('./routes/users')
const MongoClient  = require('mongoose')
const cors  = require('cors')


require('dotenv').config();


// init express 
const app = express()
// cors 
app.use(cors({ 
    // Access=Control-Allow-Origin
    // 'origin': "*",
    // accept req method
    // 'methods': 'GET,POST,PUT,PATCH,DELETE,HEAD',
    // Access-Control-Allow-Credentials
    //'credentials': true,
    // Access-Control-Allow-Headers -> accept  field authorization from request header.
    'allowedHeaders' : ['Authorization', 'Content-Type'],
    // Access-Control-Allow-Expose-Headers -> give access to field authorization
    // in response for browser
    'exposedHeaders': ['Authorization'],
    // 'preflightContinue': false,
    // "optionsSuccessStatus": 204

}))
app.use( (req, res, next)  => {
    res.removeHeader('X-Powered-By')
    next()
})
// parse application/x-www-form-urlendcode
app.use(bodyPaser.urlencoded({extended: false}))
// parse Json 
app.use(bodyPaser.json({
    // option for json req here!
    // limit : '10mb'
}));

// public upload
app.use('/uploads/', express.static(__dirname + '/uploads'))

// connect mongodb from mongoose 
MongoClient.connect(process.env.MONGO_URI,{
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
app.get('/favicon.ico', (req, res) => res.status(204));
app.use('/dish', dishRouter)
app.use('/order', orderRouter)
app.use('/booking', bookingRouter)
app.use('/subcribe', subcribeRouter)
app.use('/user', userRouter)


// Error handle 
app.use((req, res, next) => {
 
    const err =  new Error('Not Found')
    err.status = 404
    next(err)
}) 

// Error handle
app.use((error, req, res, next) => {
    const status = error.status || 500
    return res.status(status).json({
        status   : error.status,
        error   : error.message
    })
    
})

const port = process.env.PORT || 3003;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})