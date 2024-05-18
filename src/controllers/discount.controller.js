'use strict'

const { SucessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")


class DiscountController {

  // ----------------create new discount code--------------
  createDiscountCode = async (req, res, next) => {
    new SucessResponse({
      message: "Create new discount code successfully!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId
      })
    }).send(res)
  }

  // --------------create new discount code by shop----------
  getAllDiscountCodesByShop = async (req, res, next) => {
    new SucessResponse({
      message: "Successful Code Found!",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId
      })
    }).send(res)
  }

  // ------------create new discount code with product---------
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SucessResponse({
      message: "Successful Code Found!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query
      })
    }).send(res)
  }

  // ----------------create new discount code--------------
  getDiscountAmount = async (req, res, next) => {
    new SucessResponse({
      message: "Successful Code getDiscountAmount!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body
      })
    }).send(res)
  }

}

module.exports = new DiscountController()