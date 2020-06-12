const express   = require('express')
const router    = express.Router()
const dishcontroller    = require('../controller/dishcontroller')


router.route('/homepage')
    .get(dishcontroller.getSpecialDish)

router.route('/')
    .get(dishcontroller.getAll)
    .post(dishcontroller.createDish)

router.route('/:id')
    .get(dishcontroller.getOneById)

router.route('/related/:tags')
    .get(dishcontroller.getRalatedByTag)

router.route('/menu/:filter')
    .get(dishcontroller.getDishByFilter)

 

// Export router /dish/
module.exports = router