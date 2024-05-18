'use strict'

const CartService = require("../services/cart.service");
const { SucessResponse } = require('../core/success.response')

class CartController {

  //--------------------add to cart------------------------
  addToCart = async (req, res, next) => {
    new SucessResponse({
      message: 'Create new cart success',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  //--------------------update cart------------------------
  updateCart = async (req, res, next) => {
    new SucessResponse({
      message: 'Update cart success',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  //--------------------delete cart------------------------
  deleteItemCart = async (req, res, next) => {
    new SucessResponse({
      message: 'delete cart success',
      metadata: await CartService.deleteItemCart(req.body)
    }).send(res)
  }

  //--------------------get list cart------------------------
  getListCart = async (req, res, next) => {
    new SucessResponse({
      message: 'List cart success',
      metadata: await CartService.getListCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController()