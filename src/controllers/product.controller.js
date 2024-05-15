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

  // -----------------------PUT--------------------------
  publishProductByShop = async (req, res, next) => {
    new SucessResponse({
      message: "publishProductByShop successfully!",
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      })
    }).send(res)
  }
  unPublishProductByShop = async (req, res, next) => {
    new SucessResponse({
      message: "unPublishProductByShop successfully!",
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
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

  // ---------------get all publish---------------------
  getAllPublishForShop = async (req, res, next) => {
    new SucessResponse({
      message: "Get list Publish Successfully!",
      metadata: await ProductFactory.findAllPushlishForShop({
        product_shop: req.user.userId,
      })
    }).send(res)
  }

  // ---------------get all publish---------------------
  getListSearchProduct = async (req, res, next) => {
    new SucessResponse({
      message: "Get list Publish Successfully!",
      metadata: await ProductFactory.searchProductByUser(req.params)
    }).send(res)
  }

}

module.exports = new ProductController()