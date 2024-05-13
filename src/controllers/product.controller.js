'use strict'

const { SucessResponse } = require("../core/success.response")
const ProductFactory = require("../services/product.service")


class ProductController {
  createProduct = async (req, res, next) => {
    new SucessResponse({
      message: "Create new product successfully!",
      metadata: await ProductFactory.createProduct(req.body.product_type, req.body)
    }).send(res)
  }
}

module.exports = new ProductController()