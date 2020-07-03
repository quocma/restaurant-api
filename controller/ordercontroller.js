const Order = require('../model/Order');
const mongoose = require('mongoose')

const createFunc = async (req, res, next) => {
    try {
        req.body.order_items.forEach(item => {
            item.dish_id = mongoose.Types.ObjectId(item.dish_id)
        });
        let orderOjb =  new Order({
            amount: req.body.amount,
            delivery_charge: req.body.delivery_charge,
            tax: req.body.tax,
            order_items: req.body.order_items,
            custom_info: {
                name: req.body.custom_info.name,
                mail: req.body.custom_info.mail,
                phone: req.body.custom_info.phone,
                addr: req.body.custom_info.addr,
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
        const result = await Order.aggregate() 
                                    .match({_id: mongoose.Types.ObjectId(req.params.id)})
                                    .unwind("$order_items")
                                    .lookup({
                                        from: 'dishes',
                                        localField: 'order_items.dish_id',
                                        foreignField: '_id',
                                        as: 'orderdetails'
                                    })
                                    .unwind("$orderdetails")
                                    .project({
                                        id: 1,
                                        status: 1,
                                        amount: 1,
                                        order_items: {
                                            quantity: 1,
                                            orderdetails: "$orderdetails"
                                        },
                                        delivery_charge: 1,
                                        custom_info: 1,
                                        created:1,
                                        updated: 1
                                    })
                                    .group({
                                        _id: "$_id",
                                        order_info: {
                                            $mergeObjects : {
                                            status: "$status",
                                            delivery_charge:"$delivery_charge",
                                            amount: '$amount',
                                            custom_info: "$custom_info",
                                            created: "$created",
                                            updated: "$updated"
                                            }
                                        },
                                        order_items: {
                                            $push: {
                                                quantity: "$order_items.quantity",
                                                item: "$order_items.orderdetails"
                                            
                                            }
                                        }
                                    })
                              
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
        console.log(req.body);
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
        console.log(dataUpdate);
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