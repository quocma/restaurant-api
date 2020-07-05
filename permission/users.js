const {JWT_SECRET} = require('../config/index')
const jwt = require('jsonwebtoken')
const userModel = require('../model/User')

async function userVerify (req, res, next) {
    try {
        // get auth token
        let authToken = req.headers.authorization;
        // verify user
        let userDetected = jwt.verify(authToken, JWT_SECRET) 
        // check user in database
        let userExist = await userModel.findOne({username: userDetected.user})
        // has exist 
        if (userExist) {
            //  assign user info to the next middleware in req.body
            req.username = userExist.username
            req.role = userExist.role
            // pass verify
            next()
        }
        else {
            res.status(401).json({message: 'Unauthorized!'})
        }
    }
    catch (err) {
        res.status(403).json({message: 'Forbidden'})
    }
}

function checkAdminRole (req, res, next) {
    // get role from last middleware
    let role = req.role
    // check role for  method
    if(role == 'admin') {
        //  has permission 
        next()
    }
    else {
        // responese 
        res.status(405).json({message: 'Method Not Allowed!'})
    }
}
function checkStaffRole (req, res, next) {
    // get role from last middleware
    let role = req.role
    // check role for method
    if(role == 'staff' || role == "manager" || role == "admin") {
        //  has permission 
        next()
    }
    else {
        // responese 
        res.status(405).json({message: 'Method Not Allowed!'})
    }
}
function checkManagerRole (req, res, next) {
    // get role from last middleware
    let role = req.role
    // check role for  method
    if(role == 'manager' || role == 'admin') {
        //  has permission 
        next()
    }
    else {
        // responese 
        res.status(405).json({message: 'Method Not Allowed!'})
    }
}






module.exports = {
    userVerify,
    checkAdminRole,
    checkStaffRole,
    checkManagerRole
}