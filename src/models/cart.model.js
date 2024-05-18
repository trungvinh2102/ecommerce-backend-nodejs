'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "carts"

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ['active', 'complete', 'pending', 'failed'],
      default: 'active'
    },
    cart_products: {
      type: Array,
      required: true,
      default: []
    },
    cart_count_product: {
      type: Number,
      default: 0
    },
    cart_userId: {
      type: Number,
      required: true
    }

  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: 'createdOn',
      updatedAt: 'modifiedOn'
    }
  });

//Export the model
module.exports = {
  cart: model(DOCUMENT_NAME, cartSchema)
}