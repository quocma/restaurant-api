const dishModel  = require('../model/Dish');        // dish moogose model
const Order  = require('../model/Order');            // order moogose model
const s3Sevice = require('../middleware/aws');      // s3 service
const mongoose = require('mongoose');


/**
 * 
 * @param {ObjectId} itemId id of item have updated.
 * @description update total payment of order which has item in cart and status of 'P'.
 */
async function updateOrderRelateItem (itemId) {
    // find order relate change
    let orderRelates = await Order.find({status: 'P', "order_items.dish_id": {$eq: mongoose.Types.ObjectId(itemId)}})
    for(let order of orderRelates) { 
        const orderFullDetail = await Order.aggregate() 
                                    .match({_id: mongoose.Types.ObjectId(order._id)})
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
        // recaculate amount
        let newAmount = 0;
        for (let item of orderFullDetail[0].order_items)  {
            newAmount += item.quantity * item.item.price;
        }
        // console.log(newAmount)
        await Order.updateOne({_id : order._id}, {$set: {amount: newAmount}})
        
    }
}


module.exports = {
    createDish: async(req, res, next) => {   
        var dishObject = new dishModel ({
            name: req.body.name,
            price: req.body.price,
            oldprice: req.body.oldprice || 0,
            discount: req.body.discount || 0,
            img: req.file.location,         // req.file.loaction = link access to file uploaded
            tag: req.body.tags,
            short_desc: req.body.short_desc,
            long_desc: req.body.long_desc || ''
        })
        // res.send({body: req.body, file: req.file, dishObject})
        dishObject.save()
            .then( doc => {
               res.status(201).json( {
                   message: 'created',
                   result : doc
               })
            })
            .catch( e => {
                res.status(404).json( {
                    message: 'create fail!',
                    error : e
                })
            })
    },
    getAll : (req, res, next) => {
       dishModel.find({}).select('-long_desc')
       .then( result => {
           res.status(200).json({
               result
           })
       })
       .catch( e => {
        console.log('error')
            console.log(e);
            next(e);
       })
    },

    getOneById: (req, res, next) => {
       if(req.params.id) {
           let id = req.params.id;
        //    console.log(id)
           let idRegex = /^[0-9a-zA-Z]{24}$/
           if( idRegex.test(id) ){
                dishModel.findById(req.params.id)
                .then( result => {
                    if (result) {
                        return res.status(200).json({
                            result,
                            message: 'Get one dish by Id success full !!!'
                        })
                    }
                    throw Error('Not Exist !')
                })
                .catch( err => {
                    res.status(404).send(err.message);
                })
           } else {
               res.status(403).send('----> id not match type format !!!')
           }
           
       } else {
        res.status(403).send('----> id not match type format !!!')
       }
       
    },

    /**
     * @description     This controller return 5 dish of menu &
    *                   2 dish have biggest discount which show in homepage
     */
    getSpecialDish: (req, res, next) => {
        dishModel.find({}).limit(5).select({name: 1, price: 1, short_desc: 1})
        .then(result => {
            const menuItems = result;
            // find top 2 product have biggest discount
            dishModel.find({discount : {$gt : 0}}).select({name: 1, price: 1, short_desc: 1, img:1}).sort({ discount: 'asc'}).limit(2)
            .then(result => {
                const todayItems = result;
                res.json({
                    menuItems,
                    todayItems
                })
            })
            .catch( e => {
                console.log(e);
                next(e);
            })
        })
        .catch( e => {
            console.log(e);
            next(e);
        })
        
    },
    /**
     * @description     Input: tags & count from query string tags?count=xx.
     *                  return:  xx dishes realted throung tagname |
     *                  return default: 4 dishes if not passed count.
     */
    getRalatedByTag: async(req, res, next) => {
        if(req.params.tags) {
            let count = parseInt(req.query.count);
            let tagsArr = req.params.tags.split(',')
            let tagRegex1 = new RegExp(tagsArr.join(',[/\s]*'));
            let tagRegex2 = new RegExp(tagsArr.join('|'));
            if(count) {
                // get exactly count of relateddish 
                var relatedDish = await dishModel.find().where({tag: tagRegex1}).limit(count).select('-long_desc')
                if(relatedDish.length < 4) {
                    // if dont enough count serch with regrex 2;
                    let moreRelated = await dishModel.find().where({tag: tagRegex2}).limit(count - relatedDish.length).select('-long_desc')
                    relatedDish =  relatedDish.concat(moreRelated)
                }
                res.send(relatedDish);
            } else {
                // get default 4dish related
                var relatedDish = await dishModel.find().where({tag: tagRegex1}).limit(4).select('-long_desc')
                if(relatedDish.length < 4) {
                    // if dont enough count serch with regrex 2;
                    let moreRelated = await dishModel.find().where({tag: tagRegex2}).limit(4 - relatedDish.length).select('-long_desc')
                    relatedDish =  relatedDish.concat(moreRelated)
                }
                res.send(relatedDish);
            }
            
            
        }
    },
    /**
     *@description      This fuction get dishs with filter condition(all, dinner, lunch, ..etc).
                        return page from query string ?page=x&npp(number per page)=y,
                        If it don't passed return all.
     */
    getDishByFilter: async(req, res, next) => {
        if(req.params.filter) {
            var filter = req.params.filter
            var filterRegex = new RegExp(filter)
            var resultOfFilter = []
            try {
                let totalcount = 0;
                if (filter == 'all') {
                    resultOfFilter = await dishModel.find({ }).select('-long_desc')
                    totalcount = resultOfFilter.length
                } else {
                    resultOfFilter = await dishModel.find({tag: filterRegex }).select('-long_desc')
                    totalcount = resultOfFilter.length
                }
               
                if(req.query && req.query.page && req.query.npp) {
                    let page = req.query.page
                    let perPage = req.query.npp
                    resultOfFilter = resultOfFilter.slice((page*perPage) - perPage, page*perPage )
                    
                }
                res.status(200).json({
                    totalOftag : totalcount,
                    result: resultOfFilter,
                    message: 'Successful !!!'
                })
            } catch (error) {
                console.log("Filter dish fail !")
                res.status(404).json({message: 'Filter dish fail !'})
            }
            
        }
    },

    updateDish: async(req, res, next) => {   
        try {
            if(req.file) {
                // has file upload (in particular : image update)
                req.body.img = req.file.location        // req.file.loaction = link access to file uploaded
                
                // after update -> remove old image 
                const updateTarget = await dishModel.findById(req.params.id).select({img: 1})
                if (updateTarget) {
                    s3Sevice.delete(updateTarget.img, err => {throw new Error(err)})
                }
                else {
                    throw Error('Cannot find update item')
                }
            }
            const dataUpdate = req.body;
            const time = Date.now()
            const fieldToUpdate = {
                updated : time
            };
            // FLATTEN dataupdate
           /*   Nested
                input: {
                    key1 : value 1,
                    key2: {
                        subkey1: subvalue1,
                        subkey2: subvalue2,
                    }
                }
                output: {
                    key1: subvalue1,
                    key2.subkey1: subvalue1,
                    key2.subkey2: subvalue2,
                }
           */
            function flattenObject (obj,root) {
                root = root || '';
                for(let key in obj) {
                    if(Object.isExtensible(obj[key]) && !Array.isArray(obj[key])) {
                        root += `${key}.`
                        flattenObject(obj[key], root);
                    } else {
                        fieldToUpdate[`${root + key}`] = obj[key];
                    }
                    
                }
            }
            flattenObject(dataUpdate);
            const document = await dishModel.updateOne({_id : req.params.id},{$set: fieldToUpdate})
            // update related orders
            if(fieldToUpdate.hasOwnProperty('price')) {
                updateOrderRelateItem(req.params.id)
            }
            return res.status(201).json({
                message: "updated",
                result: document
                // file: req.file,
                // body: req.body,
                // fieldToUpdate
             })
            
        } catch (error) {
            return res.status(404).json({
                errors: error.errors,
                message: error.message
            })
        }
    },

    deleteDish: async(req, res, next) => {
        try {
            let deleteTarget = await dishModel.findById(req.params.id).select({img: 1})
            // delete image on s3
            s3Sevice.delete(deleteTarget.img, err => {throw new Error(err)})
            // delete on database
            let result =  await dishModel.deleteOne({ _id: req.params.id})
            //response
            res.status(201).json({
                message: 'deleted',
                result
            })
        } catch (error) {
            res.status(404).json({error: error.message})
        }
    },
    
}
