const Subcribe = require('../model/Subcribe')
const { Error } = require('mongoose')

const createFunc = async (req, res, next) => {
    try {
        let mailRegx = /^[a-z][a-z0-9_\.]*@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/g;
        if( mailRegx.test(req.body.email)) {
            let subcriber = new Subcribe({
                email: req.body.email
            })
            let result =  await subcriber.save()
            res.status(201).json({
                total: result.length,
                message: "OK!",
                result
            })
        }
        else {
            throw Error('Email not match type!')
        }
    } catch (error) {
        res.status(404).json({
            message: 'Subcribe: Create fail',
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
                 result = await Subcribe.findById(id);
                
           }
           else {
               console.log('else here')
               next();
           }
        } else {
            // find all
            result = await Subcribe.find({});
        }
        if(result.length != 0) {
            res.status(200).json({
                total : result.length,
                result
            })  
        }

   } catch (error) {
        res.status(404).json({
            message: 'Subcribe: Get fail, Id not match',
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
                let result = await Subcribe.updateOne({_id: id}, {$set: updateQuery})
                res.status(201).json({
                    result
                })
            }
            else {
                throw(new Error('Id Found!'))
            }
        }  else {
            next()
        }
   } catch (error) {
        res.status(404).json({
            message: 'Subcribe: Update fail',
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
                result = await Subcribe.deleteOne({_id: id});   
                res.status(201).json({
                    message: 'Deleted !',
                    result
                })
            }
            else {
                throw new Error('Id Found')
            }
        } else {
            next()
        }
        
   } catch (error) {
        res.status(404).json({
            message: 'Subcribe: Delete fail',
            error
        });
   }
}

// module export 
module.exports = {
    createOne : createFunc,
    getSubcribeItem: getFunc,
    update: updateFunc ,
    delete: deleteFunc
}