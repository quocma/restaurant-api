const dishModel = require('../model/Dish');
const router = require('express').Router();


router.route('/')
  .post(async (req, res, next) => {
    const dishes = await dishModel.find();

    const links = []

    for(const dish of dishes) {
      const pat = /(.*\/)/;
      const newHost = 'https://res.cloudinary.com/quocma-cloud/image/upload/v1655637514/luxury-restaurant/'
      dish.img = dish.img.replace(pat, newHost);
      dish.save();
      links.push(dish.img)
    }

    res.json({
      elements: links
    })
  })


module.exports = router;