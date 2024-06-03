'use strict'

const cloudinary = require('../configs/cloudinary.config')

const uploadImageFromUrl = async () => {
  try {
    const imageUrl = "https://images.unsplash.com/photo-1716887616455-392d1ca285f1?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    const folderName = "product/shopId", newFileName = "testdemo"

    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: newFileName,
      folder: folderName
    })
    console.log("uploadImageFromUrl ~ result:", result);
    return result
  } catch (error) {
    console.error("uploadImageFromUrl ~ error:", error);
  }
}

const uploadImageFromLocal = async ({ path, folderName = 'product/8409' }) => {
  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: 'thumb',
      folder: folderName
    })
    console.log("uploadImageFromLocal ~ result:", result);
    return {
      image_url: result.secure_url,
      shopId: 8409,
      thumb_url: await cloudinary.url(result.public_id, {
        height: 100,
        width: 100,
        format: 'jpg'
      })
    }
  } catch (error) {
    console.error("uploadImageFromLocal ~ error:", error);
  }
}

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal
}