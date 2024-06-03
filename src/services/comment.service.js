'use strict'

const { NotFoundError } = require("../core/error.response")
const commentModel = require("../models/comment.model")
const { findProduct } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils")


class CommentService {

  // ------------------- create comment----------------------
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null
  }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })

    let rightValue
    if (parentCommentId) {
      // reply comment
      const parentComment = await commentModel.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError(`Parent comment not found!`)

      rightValue = parentComment.comment_right

      // update many comment
      await commentModel.updateMany({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_right: { $gte: rightValue }
      },
        { $inc: { comment_right: 2 } }
      )

      await commentModel.updateMany({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_left: { $gt: rightValue }
      },
        { $inc: { comment_left: 2 } }
      )

    } else {
      const maxRightValue = await commentModel
        .findOne({ comment_parentId: convertToObjectIdMongodb(parentCommentId) })
        .select('comment_right')
        .sort({ comment_right: -1 })
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1
      } else {
        rightValue = 1
      }
    }

    // insert comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  // ------------------get list comment----------------------
  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 10,
    offset = 0
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId)
      if (!parent) throw new NotFoundError('Not found comment for product!')

      const comments = await commentModel
        .find({
          comment_productId: convertToObjectIdMongodb(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right }
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 })

      return comments
    }

    const comments = await commentModel
      .find({
        comment_productId: convertToObjectIdMongodb(productId),
        comment_parentId: parentCommentId
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 })

    return comments
  }

  // -------------------delete comment-----------------------
  static async deleteComment({ commentId, productId }) {

    // check product exists 
    const foundProduct = await findProduct({
      product_id: productId
    })
    if (!foundProduct) throw new NotFoundError(`Product doen't exists!`)

    // Determines the left and right values of the comment
    const comments = await commentModel.findById(commentId)
    if (!comments) throw new NotFoundError(`Comment not found!`)

    const leftValue = comments.comment_left
    const rightValue = comments.comment_right

    // width
    const width = rightValue - leftValue + 1

    // del comments child
    await commentModel.deleteMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })

    // update comment left right
    await commentModel.updateMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_right: { $gt: rightValue }
    }, {
      $inc: { comment_right: - width }
    })

    await commentModel.updateMany({
      comment_productId: convertToObjectIdMongodb(productId),
      comment_left: { $gte: rightValue }
    }, {
      $inc: { comment_left: - width }
    })

    return true
  }
}


module.exports = CommentService