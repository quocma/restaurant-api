const app = require('express')
const router = app.Router()
const bookingController = require('../controller/bookingcontroller')
const user = require('../permission/users')


router.route('/')
    .get(user.userVerify, user.checkAdminRole, bookingController.getBookingItem)
    .post(bookingController.createOne)
   

router.route('/:id') 
    .get(user.userVerify, user.checkStaffRole, bookingController.getBookingItem)
    .patch(user.userVerify, user.checkStaffRole, bookingController.update)
    .delete(user.userVerify, user.checkAdminRole, bookingController.delete)

// module export
module.exports = router;