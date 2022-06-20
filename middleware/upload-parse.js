// Define dependences 
const multer  = require('multer');                 // parse upload form
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const { cloudinary } = require('../services/cloudinary');

const CloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const filenameSplitted = file.originalname.split('.') || [];
    // get extension
    // let extension = file.originalname.match(/\.[0-9a-z]+$/i)
    let extension = filenameSplitted.pop();
    // get filename
    // let filename = file.originalname.match(/[ \w-]+?(?=\.)/);
    let filename = filenameSplitted.join('.');
    
    return {
      folder: process.env.CLOUDINARY_FOLDER,
      format: extension || 'png', // supports promises as well
      public_id: filename,
      // not public_id => filename + random chars
      use_filename: true 
    }
  }
});

// setup multer upload to cloudinary storage
const uploadParser = multer({storage: CloudStorage})


/**
 * 
 * @param {String} link link to file
 * @param {callabcks} cb error callback err => {}
 */
function deleteFucn(link , cb) {
  console.log(link)
}

module.exports = {
  uploadParser,
  delete: deleteFucn
}