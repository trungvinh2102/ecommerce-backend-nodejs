'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const binController = require('../../controllers/bin.controller');
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


router.use(authentication)

router.delete('/discount', asyncHandler(binController.deleteDiscountCode))
router.post('/move-to-discount', asyncHandler(binController.moveToDiscountCode))


module.exports = router
