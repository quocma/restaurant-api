const dishModel  = require('../model/Dish');
// const { json } = require('body-parser');

module.exports = {
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
                    return res.status(200).json({
                        result,
                        message: 'Get one dish by Id success full !!!'
                    })
                })
                .catch( err => {
                    console.log('dish controller getOneById fail : ' + err);
                    res.send(err);
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
*                       2 dish have biggest discount which show in homepage
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
                var relatedDish = await dishModel.find().where({tag: tagRegex1}).limit(count)
                if(relatedDish.length < 4) {
                    // if dont enough count serch with regrex 2;
                    let moreRelated = await dishModel.find().where({tag: tagRegex2}).limit(count - relatedDish.length);
                    relatedDish =  relatedDish.concat(moreRelated)
                }
                res.send(relatedDish);
            } else {
                // get default 4dish related
                var relatedDish = await dishModel.find().where({tag: tagRegex1}).limit(4)
                if(relatedDish.length < 4) {
                    // if dont enough count serch with regrex 2;
                    let moreRelated = await dishModel.find().where({tag: tagRegex2}).limit(4 - relatedDish.length);
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
                    resultOfFilter = await dishModel.find({ })
                    totalcount = resultOfFilter.length
                } else {
                    resultOfFilter = await dishModel.find({tag: filterRegex })
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

    createDish: (req, res, next) => {
        var dishObject = new dishModel ({
            name: 'bo` bit  tet',
            price: 50000,
            oldprice: 70000,
            discount: 10,
            img: 'abv',
            tag: 'soup, lunch',
            short_desc: 'short asdfkjhaskdf',
            long_desc: 'long'
        })
        dishObject.save()
            .then( doc => {
                console.log('created from Dish model' + doc);
                res.status(200)
                res.send(doc)
            })
            .catch( e => {
                console.log(e);
            })
    }
}
