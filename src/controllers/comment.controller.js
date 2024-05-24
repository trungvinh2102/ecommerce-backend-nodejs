'use strict'

const CommentService = require("../services/comment.service");
const { SucessResponse } = require('../core/success.response')

class CommentController {

  //--------------------create comment------------------------
  createComment = async (req, res, next) => {
    new SucessResponse({
      message: 'Create new comment success!',
      metadata: await CommentService.createComment(req.body)
    }).send(res)
  }

  //-------------------delete comment------------------------
  deleteComment = async (req, res, next) => {
    new SucessResponse({
      message: 'deleteComment success!',
      metadata: await CommentService.deleteComment(req.body)
    }).send(res)
  }

  //--------------------get list comment------------------------
  getCommentByParentId = async (req, res, next) => {
    new SucessResponse({
      message: 'Get list comment success!',
      metadata: await CommentService.getCommentByParentId(req.query)
    }).send(res)
  }
}


module.exports = new CommentController()