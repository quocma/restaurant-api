const express   = require('express')
const router    = express.Router()
const dishcontroller    = require('../controller/dishcontroller')

// setup multer
const multer  = require('multer')
// init upload dir and filename
const storage = multer.diskStorage({
    destination: (req, res , cb) => {
        cb('null', '/uploads')
    },
    filename: (req, file, cb ) => {
        req.body.filename =  file.fieldname + '-' + Date.now();
        cb( err => console.log('Multer set file name fail at line 10 - dishscontroller' + err), req.body.filename)
    }
})
const upload = multer({storage : storage})


router.route('/homepage')
    .get(dishcontroller.getSpecialDish)

router.route('/')
    .get(dishcontroller.getAll)
    .post(upload.single('img'), dishcontroller.createDish);

router.route('/:id')
    .get(dishcontroller.getOneById)

router.route('/related/:tags')
    .get(dishcontroller.getRalatedByTag)

router.route('/menu/:filter')
    .get(dishcontroller.getDishByFilter)

 

// Export router /dish/
module.exports = router