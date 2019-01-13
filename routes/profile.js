const { Router } = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const { 
  getProfile, 
  postProfile,
  postImage 
} = require('../controllers/profile');
// only for development
// const { 
//   secretAccessKey,
//   accessKeyId,
//   region
// } = require('../config/aws_configuration')

const router = Router();

aws.config.update({
  secretAccessKey: process.env.SECRET_KEY /* || secretAccessKey */,
  accessKeyId: process.env.KEY_ID /* || accessKeyId */,
  region: process.env.REGION /* || region */
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'lonely-photo',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function(req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})


// handle get request for profile
router.get('/', getProfile);

// handle post request for profile edit
router.post('/', postProfile);

// handle post request for profile/upload
router.post('/upload', upload.array('image',1), postImage)

module.exports = router;