'use strict'

const cloudinary = require('cloudinary').v2
const { cloudiary: { cloud_name, api_key, api_secret } } = require('./config')

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

module.exports = cloudinary