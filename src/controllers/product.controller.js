'use strict'

const { SucessResponse } = require("../core/success.response")
const ProductFactory = require("../services/product.service")


class ProductController {

  // -----------------create new product-----------------
  createProduct = async (req, res, next) => {
    new SucessResponse({
      message: "Create new product successfully!",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      })
    }).send(res)
  }


  // -----------------get all draft----------------------
  getAllDraftsForShop = async (req, res, next) => {
    new SucessResponse({
      message: "Get list Draft Successfully!",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      })
    }).send(res)
  }
}

module.exports = new ProductController()