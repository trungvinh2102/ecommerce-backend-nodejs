'use strict'

const { BadRequestError } = require('../core/error.response')
const {
  inventory
} = require('../models/inventory.model')
const { getProductById } = require('../models/repositories/product.repo')

class InventoryService {

  // --------------------- add stock to inventory---------------
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = 'Hoang Mai, Ha Noi'
  }) {
    const product = await getProductById(productId)
    if (!product) throw new BadRequestError('The product does not exitsts!')

    const query = { inven_productId: productId, inven_shopId: shopId },
      updateSet = {
        $inc: {
          inven_stock: stock
        },
        $set: {
          inven_location: location
        }
      },
      options = { upsert: true, new: true }

    return await inventory.findOneAndUpdate(query, updateSet, options)
  }

  // -------------------- update stock inventory---------------
  static async updateStockToInventory(inventoryId, payload) {
    const {
      stock,
      productId,
      shopId,
      location = 'Hoang Mai, Ha Noi'
    } = payload

    if (!inventoryId) throw new ("Inventory doe not exitst!")

    const product = await getProductById(productId)
    if (!product) throw new BadRequestError('The product does not exitsts!')

    const updateStockToInventory = {
      inven_productId: productId,
      inven_shopId: shopId,
      inven_stock: stock,
      inven_location: location
    }

    const updateInventory = inventory.findByIdAndUpdate(inventoryId, updateStockToInventory, { new: true })

    if (!updateInventory) throw new BadRequestError("Inventory doen't exitst!")

    return updateInventory
  }
}


module.exports = InventoryService