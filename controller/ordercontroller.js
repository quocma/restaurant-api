const Order = require('../model/Order');


const createFunc = async (req, res, next) => {
    try {
        let orderOjb =  new Order({
            amount: req.body.amount,
            delivery_charge: req.body.delivery_charge,
            tax: req.body.tax,
            order_items: req.body.order_items,
            custom_info: {
                name: req.body.custom_info.name,
                mail: req.body.custom_info.mail,
                Phone: req.body.custom_info.phone,
                addr: req.body.custom_info.phone,
                note: req.body.custom_info.note
            }
        })
         const result = await orderOjb.save();
         return res.status(200).json({
            total: result.length,
            message: "inserted",
            result,
         })
    } catch (error) {
         return res.status(404).json({
            errors: error.errors,
            message: error.message
        })
    }
}
const getFunc = async (req, res, next) => {
    try {
        const result = await Order.find({})
        return res.status(200).json({
            total: result.length,
            message: "success",
            result,
         })
        
    } catch (error) {
        return res.status(404).json({
            errors: error.errors,
            message: error.message
        })
    }
}
const getSpecFunc = async (req, res, next) => {
    try {
        const result = await Order.find({ _id : req.params.id})
        return res.status(200).json({
            total: result.length,
            message: "success",
            result,
         })
        
    } catch (error) {
        return res.status(404).json({
            errors: error.errors,
            message: error.message
        })
    }
}
const updateSpecFunc = async (req, res, next) => {
    try {
        const time = Date.now()
        const dataUpdate = req.body;
        const fieldToUpdate = {
            updated : time
        };
        // FLATTEN dataupdate
        function flattenObject (obj,root) {
            root = root || '';
            for(let key in obj) {
                if(Object.isExtensible(obj[key])) {
                    root += `${key}.`
                    flattenObject(obj[key], root);
                } else {
                    fieldToUpdate[`${root + key}`] = obj[key];
                }
                
            }
        }
        flattenObject(dataUpdate);

        const document = await Order.updateOne({_id : req.params.id},{$set: fieldToUpdate})
        return res.status(200).json({
            message: "updated",
            document,
         })
        
    } catch (error) {
        return res.status(404).json({
            errors: error.errors,
            message: error.message
        })
    }
}

const deleteSpecFunc = async (req, res, next) => {
    try {
        const result = await Order.deleteOne({_id: req.params.id})
        return res.status(200).json({
            total: result.length,
            message: "deleted",
            result,
         })
        
    } catch (error) {
        return res.status(404).json({
            errors: error.errors,
            message: error.message
        })
    }
}



// module exportx
module.exports = {
    createOrder: createFunc,
    getOrder: getFunc,
    getSpecificOrder: getSpecFunc,
    updateSpecificOrder: updateSpecFunc,
    deleteSpecificOrder: deleteSpecFunc
}