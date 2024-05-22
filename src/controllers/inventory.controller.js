'use strict'

const InventoryService = require("../services/inventory.service");
const { SucessResponse } = require('../core/success.response')

class InventoryController {
  //
  addStockToInventory = async (req, res, next) => {
    new SucessResponse({
      message: 'Create new cart addStockToInventory',
      metadata: await InventoryService.addStockToInventory(req.body)
    }).send(res)
  }
}

module.exports = new InventoryController()