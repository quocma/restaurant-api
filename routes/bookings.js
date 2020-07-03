const app = require('express')
const router = app.Router()
const bookingController = require('../controller/bookingcontroller')


router.route('/')
    .get(bookingController.getBookingItem)
    .post(bookingController.createOne)
   

router.route('/:id') 
    .get(bookingController.getBookingItem)
    .patch(bookingController.update)
    .delete(bookingController.delete)

// module export
module.exports = router;