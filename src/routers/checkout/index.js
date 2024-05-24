'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const checkoutController = require('../../controllers/checkout.controller');
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

router.post('/review', asyncHandler(checkoutController.checkoutReview))

router.use(authentication)

router.post('/order', asyncHandler(checkoutController.orderByUser))

module.exports = router