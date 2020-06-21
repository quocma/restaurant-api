const app = require('express')
const router = app.Router()
const subcribeController = require('../controller/subcribecontroller')
const contactController = require('../controller/contactcontroller')


router.route('/')
    .get(subcribeController.getSubcribeItem)
    .post(subcribeController.createOne)
   

router.route('/:id') 
    .get(subcribeController.getSubcribeItem)
    .patch(subcribeController.update)
    // .delete(subcribeController.delete)

router.route('/contact')
    .get(contactController.getContactItem)
    .post(contactController.createOne)
router.route('/contact/:id')
    .get(contactController.getContactItem)
    .patch(contactController.createOne)
    // .delete(contactController.delete)
// module export
module.exports = router;