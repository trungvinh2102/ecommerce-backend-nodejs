'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const { uploadDick, uploadMemory } = require('../../configs/multer.config');
const router = express.Router()

// cloudinary
router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDick.single('file'), asyncHandler(uploadController.uploadLocalFileThumb))

// s3 aws
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadFileFormLocalS3))


module.exports = router