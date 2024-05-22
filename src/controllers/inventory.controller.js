'use strict'

const InventoryService = require("../services/inventory.service");
const { SucessResponse } = require('../core/success.response')

class InventoryController {

  // ------------------ add stock to inventory-----------------
  addStockToInventory = async (req, res, next) => {
    new SucessResponse({
      message: 'Create new cart addStockToInventory',
      metadata: await InventoryService.addStockToInventory(req.body)
    }).send(res)
  }

  // -------------------update stock to inventory
  updateStockToInventory = async (req, res, next) => {
    new SucessResponse({
      message: 'Create new cart addStockToInventory',
      metadata: await InventoryService.updateStockToInventory(req.params.inventoryId,
        {
          ...req.body
        }
      )
    }).send(res)
  }
}

module.exports = new InventoryController()