const app = require('express')
const router = app.Router()
const subcribeController = require('../controller/subcribecontroller')
const contactController = require('../controller/contactcontroller')

const user = require('../permission/users')


router.route('/')
    .get(subcribeController.getSubcribeItem)
    .post(subcribeController.createOne)
   

router.route('/:id') 
    .get(subcribeController.getSubcribeItem)
    .patch(subcribeController.update)
    // .delete(subcribeController.delete)

router.route('/contact')
    .get(user.userVerify, user.checkStaffRole, contactController.getContactItem)
    .post(contactController.createOne)
router.route('/contact/:id')
    .get(user.userVerify, user.checkStaffRole,contactController.getContactItem)
    .patch(user.userVerify, user.checkManagerRole,contactController.createOne)
    .delete(user.userVerify, user.checkAdminRole,contactController.delete)
// module export
module.exports = router;