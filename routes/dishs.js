const express   = require('express')
const router    = express.Router()
const dishcontroller    = require('../controller/dishcontroller')

// setup multer
const multer  = require('multer')
// init upload dir and filename
const storage = multer.diskStorage({
    destination: function (req, res , cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb ) {
        // get file uploads name
        let filename = file.originalname.match(/.*(?=.jpg|.png|.jpeg)/);
        // get extension
        let extension = file.originalname.match(/\.(jpg|png|jpeg)/)
        cb( null, filename + '-' + Date.now() + extension[0])
    }
})
const upload = multer({storage: storage})


router.route('/homepage')
    .get(dishcontroller.getSpecialDish)

router.route('/')
    .get(dishcontroller.getAll)
    .post(upload.single('thumbnail'), dishcontroller.createDish);

router.route('/:id')
    .get(dishcontroller.getOneById)
    .put(upload.single('thumbnail'), dishcontroller.updateDish)
    .delete(dishcontroller.deleteDish)
router.route('/related/:tags')
    .get(dishcontroller.getRalatedByTag)

router.route('/menu/:filter')
    .get(dishcontroller.getDishByFilter)

 

// Export router /dish/
module.exports = router