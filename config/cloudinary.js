// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'dpga2xk2l',
  api_key: '268848599614971',
  api_secret: '4Y7Rqn1oMqF_3XnhYTIyrdaqAFw',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'userprofile',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

module.exports = { cloudinary, storage };
