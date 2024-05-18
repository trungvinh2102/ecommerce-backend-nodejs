'use strict'

const express = require('express')
const { apiKey, permissions } = require('../auth/checkAuth')
const router = express.Router()

// check api key
router.use(apiKey)

// check permission
router.get(permissions('0000'))

router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/shop', require('./access'))

module.exports = router