const express = require('express')
const router = express.Router()

const userController = require('../controller/usercontroller')

router.route('/')
    .get(userController.getUser)
    .post(userController.createOne)

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.update)
    .delete(userController.delete)

router.route('/auth')
    .post(userController.checklogin)

module.exports = router