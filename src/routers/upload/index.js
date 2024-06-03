'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const { uploadDick } = require('../../configs/multer.config');
const router = express.Router()


router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDick.single('file'), asyncHandler(uploadController.uploadLocalFileThumb))

module.exports = router