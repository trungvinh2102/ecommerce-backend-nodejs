'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Comment"
const COLLECTION_NAME = "comments"

const commentSchema = new Schema(
  {
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    comment_userId: {
      type: Number,
      default: 1
    },
    comment_content: {
      type: String,
      required: true
    },
    comment_left: {
      type: Number,
      default: 0
    },
    comment_right: {
      type: Number,
      default: 0
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timeseries: true,
    collection: COLLECTION_NAME
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, commentSchema)
