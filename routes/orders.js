const express = require('express')
const { get } = require('mongoose')
const router = express.Router()
const orderController = require('../controller/ordercontroller')
const ordercontroller = require('../controller/ordercontroller')

// -- GET ALL ORDER
// -- POST SUBMIT NEW ORDER
router.route('/')
    .get(orderController.getOrder)
    .post(orderController.createOrder)

// GET SPECIFICS ORDER
router.route('/:id')
    .get(orderController.getSpecificOrder)
    .patch(orderController.updateSpecificOrder)
    .delete(orderController.deleteSpecificOrder)

// module export
module.exports = router