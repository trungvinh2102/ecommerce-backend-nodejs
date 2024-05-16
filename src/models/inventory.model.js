'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Inventory"
const COLLECTION_NAME = "inventories"

const inventorySchema = new Schema(
  {
    inven_product: {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
    inven_location: {
      type: String,
      default: 'unKnow'
    },
    iven_stock: {
      type: Number,
      default: true
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop"
    },
    iven_reservations: {
      type: Array,
      default: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  });

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema)
}