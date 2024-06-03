'use strict'

const express = require('express');
const { authentication } = require('../../auth/authUtils');
const asyncHandler = require('../../helpers/asyncHandler');
const discountController = require('../../controllers/discount.controller');
const router = express.Router()

// get all discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

// authentication
router.use(authentication)

router.post('', asyncHandler(discountController.createDiscountCode))
router.patch('/:discountId', asyncHandler(discountController.updateDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))
router.post('/move-to-bin', asyncHandler(discountController.moveToBinDiscountCode))
router.get('/search/:keySearch', discountController.cancelDiscountCode)


module.exports = router