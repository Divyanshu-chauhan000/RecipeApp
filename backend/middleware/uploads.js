const multer = require('multer');
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require('../config/cloudinary');

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder : "profile-pics",
    allowed_formats : ["jpg" , "png", "jpeg"],
  },
})

const recipeStorage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder : "recipe-pic",
    allowed_formats : ["jpg" , "png", "jpeg"],
  },
})

const profileUploads = multer({storage: profileStorage})
const recipeUploads = multer({storage: recipeStorage})

module.exports = { profileUploads, recipeUploads };