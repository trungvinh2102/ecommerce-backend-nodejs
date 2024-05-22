'use strict'

const { BadRequestError } = require('../core/error.response')
const {
  inventory
} = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {

  //
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = 'Hoang Mai, Ha Noi'
  }) {
    const product = await getProductById(productId)
    if (!product) throw new BadRequestError('The product does not exitsts!')

    const quey = { inven_productId: productId, inven_shopId: shopId },
      updateSet = {
        $inc: {
          inven_stock: stock
        },
        $set: {
          inven_location: location
        }
      },
      options = { upsert: true, new: true }

    return await inventory.findOneAndUpdate(quey, updateSet, options)
  }
}


module.exports = InventoryService