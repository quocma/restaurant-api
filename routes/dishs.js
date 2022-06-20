const express   = require('express')
const router    = express.Router();

// controller
const dishcontroller    = require('../controller/dishcontroller')

// user permission 
const user = require ('../permission/users')

//  upload parser
const { uploadParser } = require('../middleware/upload-parse')


router.route('/homepage')
    .get(dishcontroller.getSpecialDish)

router.route('/')
    .get(dishcontroller.getAll)
    // only admin access
    .post(user.userVerify, user.checkAdminRole, uploadParser.single('thumbnail'), dishcontroller.createDish);

router.route('/:id')
    .get(dishcontroller.getOneById)
    // role maaneger meaning : both manager and admin can be access
    .put(user.userVerify, user.checkManagerRole, uploadParser.single('thumbnail'), dishcontroller.updateDish)
    //only admin
    .delete(user.userVerify, user.checkAdminRole,dishcontroller.deleteDish)

// router.route('/testupdate/:id') 
//     .put(dishcontroller.updateOrderRelateItem)

router.route('/related/:tags')
    .get(dishcontroller.getRalatedByTag)

router.route('/menu/:filter')
    .get(dishcontroller.getDishByFilter)

 

// Export router /dish/
module.exports = router