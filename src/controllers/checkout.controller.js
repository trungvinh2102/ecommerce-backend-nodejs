'use strict'

const CheckoutService = require("../services/checkout.service");
const { SucessResponse } = require('../core/success.response')

class CheckoutController {

  // -----------------check out review-------------------
  checkoutReview = async (req, res, next) => {
    new SucessResponse({
      message: "Checkout success!",
      metadata: await CheckoutService.checkoutReview(req.body)
    }).send(res)
  }

  // --------------------order by user---------------------
  orderByUser = async (req, res, next) => {
    new SucessResponse({
      message: "Order success!",
      metadata: await CheckoutService.orderByUser(req.body)
    }).send(res)
  }
}

module.exports = new CheckoutController()