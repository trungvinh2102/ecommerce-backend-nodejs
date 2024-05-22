'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Order"
const COLLECTION_NAME = "orders"

const orderSchema = new Schema(
  {
    order_userId: {
      type: String,
      required: true
    },
    order_checkout: {
      type: Object,
      default: {}
    },
    order_shipping: {
      type: Object,
      default: {}
    },
    order_payment: {
      type: Object,
      default: {}
    },
    order_products: {
      type: Array,
      required: true
    },
    order_trackingNumber: {
      type: String,
      enum: ['pending', 'comfirmed', 'shipped', 'cancelled', 'deliverd'],
      default: 'pending'
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

//Export the model
module.exports = {
  order: model(DOCUMENT_NAME, orderSchema)
}