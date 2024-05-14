'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const router = express.Router()

// authentication
router.use(authentication)

// product
router.post('', asyncHandler(productController.createProduct))

module.exports = router