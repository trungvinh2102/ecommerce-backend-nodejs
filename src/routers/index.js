'use strict'

const express = require('express')
const { apiKey, permissions } = require('../auth/checkAuth')
const router = express.Router()

// check api key
router.use(apiKey)

// check permission
router.get(permissions('0000'))

router.use('/v1/api', require('./access'))

module.exports = router