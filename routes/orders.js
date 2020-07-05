const express = require('express')
const router = express.Router()
const orderController = require('../controller/ordercontroller')
const ordercontroller = require('../controller/ordercontroller')

const user = require('../permission/users')

// -- GET ALL ORDER
// -- POST SUBMIT NEW ORDER
router.route('/')
    .get(user.userVerify, user.checkStaffRole, orderController.getOrder)
    .post(orderController.createOrder)

// GET SPECIFICS ORDER
router.route('/:id')
    .get(user.userVerify, user.checkStaffRole, orderController.getSpecificOrder)
    // give access for staff,manager, admin
    .patch(user.userVerify, user.checkStaffRole, orderController.updateSpecificOrder)
    .delete(user.userVerify, user.checkAdminRole,orderController.deleteSpecificOrder)

// module export
module.exports = router