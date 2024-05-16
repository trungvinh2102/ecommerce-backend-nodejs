'use strict'

const { inventory } = require("../inventory.model")
const { Types } = require('mongoose')

const insertInventory = async ({
  productId, shopId, stock, location = "unKnow"
}) => {
  return await inventory.create({
    inven_product: productId,
    inven_shopId: shopId,
    iven_stock: stock,
    inven_location: location,
  })
}

module.exports = {
  insertInventory
}