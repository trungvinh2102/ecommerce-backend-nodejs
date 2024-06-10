'use strict'

const { PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('@aws-sdk/client-s3')
const cloudinary = require('../configs/cloudinary.config')
const {
  aws: {
    aws_bucket_name,
    aws_bucket_clound_front_domain_name,
    aws_bucket_clound_front_key_group,
    aws_bucket_private_key_id
  } }
  = require('../configs/config')
const { s3 } = require('../configs/s3.config')
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer"); // CJS
const { ramdomImageName } = require('../utils')


// upload file s3client
const uploadImageFromLocalS3 = async ({ file }) => {
  try {
    const imageName = ramdomImageName()
    const command = new PutObjectCommand({
      Bucket: aws_bucket_name,
      Key: imageName,
      Body: file.buffer,
      ContentType: 'image/jpeg'
    })

    const result = await s3.send(command)
    console.log("uploadImageFromLocalS3 ~ result:", result);
    const signedUrl = getSignedUrl({
      url: `${aws_bucket_clound_front_domain_name}/${imageName}`,
      keyPairId: aws_bucket_clound_front_key_group,
      dateLessThan: new Date(Date.now() + 1000 * 60).toISOString(),
      privateKey: aws_bucket_private_key_id,
    });
    console.log("uploadImageFromLocalS3 ~ signedUrl:", signedUrl);
    return {
      signedUrl,
      result
    }
  } catch (error) {
    console.error("uploadImageFromLocalS3 ~ error:", error);
  }
}


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

const uploadImageFromLocalCloudinary = async ({ path, folderName = 'product/8409' }) => {
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
  uploadImageFromLocalCloudinary,
  uploadImageFromLocalS3
}