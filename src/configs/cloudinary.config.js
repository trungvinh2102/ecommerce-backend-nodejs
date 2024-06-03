'use strict'


require('dotenv').config()
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDARY_CLOUND_NAME,
  api_key: process.env.CLOUDARY_API_KEY,
  api_secret: process.env.CLOUDARY_API_SECRET
});

module.exports = cloudinary