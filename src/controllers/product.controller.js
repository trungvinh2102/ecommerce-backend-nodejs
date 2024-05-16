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

  // ------------------update product--------------------
  updateProduct = async (req, res, next) => {
    new SucessResponse({
      message: "Update product successfully!",
      metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.productId, {
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

  // ---------------find all products---------------------
  findAllProducts = async (req, res, next) => {
    new SucessResponse({
      message: "Get list findAllProduct Successfully!",
      metadata: await ProductFactory.findAllProducts(req.query)
    }).send(res)
  }

  // ---------------find product---------------------
  findProduct = async (req, res, next) => {
    new SucessResponse({
      message: "Get list findProduct Successfully!",
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id
      })
    }).send(res)
  }

}

module.exports = new ProductController()