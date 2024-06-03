'use strict'

const BinService = require("../services/bin.service");
const { SucessResponse } = require('../core/success.response')

class CheckoutController {

  // --------------delete discount -------------------------
  deleteDiscountCode = async (req, res, next) => {
    new SucessResponse({
      message: 'Delete Discount Successfully!',
      metadata: await BinService.deleteDiscountCode({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  // ---------------move to bin discount code --------------
  moveToDiscountCode = async (req, res, next) => {
    new SucessResponse({
      message: "Move to discount code successfully!",
      metadata: await BinService.moveToDiscountCode({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

}


module.exports = new CheckoutController()