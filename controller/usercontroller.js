const userModel = require('../model/User')

const createFunc = async (req, res, next) => {
    try {
       let user = new userModel({
           username: req.body.username,
           password: req.body.password,
           role: req.body.role
       })
       let result =  await user.save();
       res.status(201).json({
           total: result.length,
           message: "OK!",
           result
       })
        
    } catch (error) {
        res.status(404).json({
            message: 'user: Create fail',
            error
        });
    }
}
const findUserFunc = async (req, res, next) => {
    try {
        const result = await userModel.findOne({username: req.body.username, password: req.body.password})
        if( result) {
            res.status(200).json({
                auth: true,
                result
            })
        } 
        else {
            throw new Error('Auth fail')
        }
    } catch (error) {
        res.status(404).json({error : error.message})
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
                 result = await userModel.findById(id);
                
           }
           else {
               throw new Error('Id Found')
           }
        } else {
            // find all
            result = await userModel.find({});
        }
        res.status(200).json({
            total : result.length,
            result
        })  

   } catch (error) {
        res.status(404).json({
            message: 'user: Get fail, Id not match',
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
                let result = await userModel.updateOne({_id: id}, {$set: updateQuery})
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
            message: 'user: Update fail',
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
            result = await userModel.deleteOne({_id: id});   
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
    getUser: getFunc,
    checklogin: findUserFunc,
    update: updateFunc ,
    delete: deleteFunc
}