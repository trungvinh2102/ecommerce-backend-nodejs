'use strict'

const express = require('express');
const profileController = require('../../controllers/profile.controller');
const { grantAccess } = require('../../middlewares/rbac.middleware');
const router = express.Router()

router.get('/viewAny', grantAccess('readAny', 'profile'), profileController.profiles)
router.get('/viewOwn', grantAccess('readOwn', 'profile'), profileController.profile)

module.exports = router
