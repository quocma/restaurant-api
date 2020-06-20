const bookingModel = require('../model/Booking')
const { Error } = require('mongoose')

const createFunc = async (req, res, next) => {
    try {
       let bookingObj = new bookingModel({
           name: req.body.name,
           email: req.body.email,
           phone: req.body.phone,
           time: req.body.time,
           date: req.body.date,
           note: req.body.note,
           guest: req.body.guest
       })
       let result =  await bookingObj.save()
       res.status(201).json({
           total: result.length,
           message: "OK!",
           result
       })
        
    } catch (error) {
        res.status(404).json({
            message: 'booking: Create fail',
            error
        });
    }
}
const getFunc = async (req, res, next) => {
   try {
       let result = [];
        // has id -> findOne
        if(req.params.id) {
            let id = req.params.id;
            //    console.log(id)
           let idRegex = /^[0-9a-zA-Z]{24}$/
           if(idRegex.test(id)) {
                 result = await bookingModel.findById(id);
                
           }
           else {
               throw new Error('Id Found')
           }
        } else {
            // find all
            result = await bookingModel.find({});
        }
        res.status(200).json({
            total : result.length,
            result
        })  

   } catch (error) {
        res.status(404).json({
            message: 'booking: Get fail, Id not match',
            error
        });
   }
}
const updateFunc = async (req, res, next) => {
   try { 
        if(req.params.id) {
            let id = req.params.id
            //    console.log(id)
            let idRegex = /^[0-9a-zA-Z]{24}$/
            if( idRegex.test(id) ) {
                // if body {} has field match document field -> update else nothing.
                let updateQuery = req.body
                //  add field updated for document
                updateQuery.updated =  Date.now();
                let result = await bookingModel.updateOne({_id: id}, {$set: updateQuery})
                res.status(201).json({
                    result
                })
            }
            else {
                throw(new Error('Id Found!'))
            }
        }
   } catch (error) {
        res.status(404).json({
            message: 'booking: Update fail',
            error : error
        });
   }
}
const deleteFunc = async (req, res, next) => {
    try {
        if(req.params.id) {
            let id = req.params.id;
            //    console.log(id)
        let idRegex = /^[0-9a-zA-Z]{24}$/
        if(idRegex.test(id)) {
            result = await bookingModel.deleteOne({_id: id});   
            res.status(201).json({
                message: 'Deleted !',
                result
            })
        }
        else {
            throw new Error('Id Found')
        }
        }
   } catch (error) {
        res.status(404).json({
            message: 'booking: Delete fail',
            error
        });
   }
}

// module export 
module.exports = {
    createOne : createFunc,
    getBookingItem: getFunc,
    update: updateFunc ,
    delete: deleteFunc
}