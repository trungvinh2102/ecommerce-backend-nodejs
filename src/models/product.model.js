'use strict'

const { Schema, model, Types } = require('mongoose')

const COLLECTION_NAME = "Product"
const DOCUMENT_NAME = "Products"

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true
    },
    product_quantity: {
      type: Number,
      required: true
    },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop"
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  })

// define the product type = clothings
const clothingSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
}, {
  timestamps: true,
  collection: 'clothes'
})

// define the product type = electronics
const electronicsSchema = new Schema({
  manufacturer: {
    type: String,
    required: true
  },
  model: String,
  color: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  }
}, {
  timestamps: true,
  collection: 'electronics'
})

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicsSchema),
  clothing: model('Clothing', clothingSchema)
}