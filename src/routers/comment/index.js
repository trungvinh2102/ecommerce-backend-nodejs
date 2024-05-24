'use strict'

const express = require('express');
const asyncHandler = require('../../helpers/asyncHandler');
const commentController = require('../../controllers/comment.controller');
const { authentication } = require('../../auth/authUtils')
const router = express.Router()


router.use(authentication)

router.post('', asyncHandler(commentController.createComment))
router.delete('', asyncHandler(commentController.deleteComment))
router.get('', asyncHandler(commentController.getCommentByParentId))

module.exports = router