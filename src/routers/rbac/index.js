'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const rbacController = require('../../controllers/rbac.controller');
const router = express.Router()

router.post('/role', asyncHandler(rbacController.newRole))
router.get('/roles', asyncHandler(rbacController.listRoles))

router.post('/resource', asyncHandler(rbacController.newResource))
router.get('/resources', asyncHandler(rbacController.listResources))

module.exports = router