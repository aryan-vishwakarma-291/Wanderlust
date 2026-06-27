const cloudinary = require('cloudinary').v2; //to require cloudinary
const { string } = require('joi');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({  //to connect it to cloudinary
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

 
const storage = new CloudinaryStorage({ // just like we create a folder in drive
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowerdFormats: ["png","jpg","jpeg"]// supports promises as well
    
  },
});

module.exports = {
    cloudinary,
    storage
}
