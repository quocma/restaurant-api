// Define dependences 
const aws = require('aws-sdk')                      // aws service
const credentials = require('./config.json')        // credentials for aws service
const multer  = require('multer')                   // parse upload form
const multerS3 = require('multer-s3')               // Streaming multer storage engine for AWS S3.

// Add cridentials
// Error: no such file directory
// aws.config.loadFromPath('./config.json')
// Instead, ...
aws.config.update({"accessKeyId": credentials.accessKeyId, "secretAccessKey": credentials.secretAccessKey, "region": credentials.region});

// init s3 
const bucket = 'luxury-images'
const s3 = new aws.S3()

// init s3 storage 
const s3Storage = multerS3({
    s3: s3,
    bucket: bucket,
    // access control for the file
    acl: 'public-read',
    // setup name of file
    key: function(req, file, cb) {
       // get file uploads name
       let filename = file.originalname.match(/.*(?=.jpg|.png|.jpeg)/);
       // get extension
       let extension = file.originalname.match(/\.(jpg|png|jpeg)/)
       cb( null, filename + '-' + Date.now().toString() + extension[0])
    },

})

// setup multer upload to s3 storage
const upload = multer({storage: s3Storage})


/**
 * 
 * @param {String} link link to file
 * @param {callabcks} cb error callback err => {}
 */
function deleteFucn(link , cb) {
    // get name of file
    const key = link.match(/[^\/]+(.jpg|png|jpeg)$/)
    let fileName = ''
    if (key) {
        fileName = key[0] 
    }
    // call delete object from s3 object define above
    s3.deleteObject({  
        Bucket: bucket,         // buketname define above           
        Key: fileName ,        
    },function (err,data){
        if (err) {
            cb(err)
        }
    })
}

module.exports = {
    upload,
    delete: deleteFucn
}