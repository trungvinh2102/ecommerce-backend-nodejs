'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
const router = express.Router()

router.use(authentication)
router.get('', asyncHandler(notificationController.getAllNotiByUser))

module.exports = router