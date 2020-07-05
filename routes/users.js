const express = require('express')
const router = express.Router()

// check user permission
const user = require('../permission/users')

const userController = require('../controller/usercontroller')

router.route('/')
    // only manager & admin has access
    .get(user.userVerify, user.checkManagerRole, userController.getUser)
    // only admin
    .post(user.userVerify, user.checkAdminRole, userController.createOne)

router.route('/:id')
     // only manager & admin has access
    .get(user.userVerify, user.checkManagerRole, userController.getUser)
    // only admin
    .patch(user.userVerify, user.checkAdminRole,userController.update)
    .delete(user.userVerify, user.checkAdminRole,userController.delete)

router.route('/auth')
    .post(userController.checklogin)


// export router for app
module.exports = router

