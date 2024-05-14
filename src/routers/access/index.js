'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// sign up
router.post('/signup', asyncHandler(accessController.signUp))

// login
router.post('/login', asyncHandler(accessController.login))

// authentication
router.use(authentication)

// logout
router.post('/logout', asyncHandler(accessController.logout))

//handle refresh token
router.post('/handleRefreshtoken', asyncHandler(accessController.handleRefreshToken))

module.exports = router