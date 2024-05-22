'use strict'

const { BadRequestError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { order } = require("../models/order.model")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

class CheckoutService {

  // ----------------------checkout review-------------------------
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {

    // check cartId
    const foundShop = await findCartById(cartId)
    if (!foundShop) throw new BadRequestError(`Cart doen't exitst!`);

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0
    }, shop_order_ids_new = []

    // total bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, items_products = [], shop_discounts = [] } = shop_order_ids[i]
      const checkoutOrderServer = await checkProductByServer(items_products)
      console.log("CheckoutService ~ checkoutReview ~ checkoutOrderServer:", checkoutOrderServer);
      if (!checkoutOrderServer[0]) throw new BadRequestError('Order wrong!');

      // total bill
      const checkoutPrice = checkoutOrderServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      // total
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        items_products: checkoutOrderServer
      }

      if (shop_discounts.length > 0) {
        const { discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          shopId,
          userId,
          products: checkoutOrderServer
        })

        //
        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)

    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    }
  }

  //------------------------create order---------------------------
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
      cartId,
      userId,
      shop_order_ids
    })

    const products = shop_order_ids_new.flatMap(order => order.items_products)
    console.log("CheckoutService ~ products:", products);
    const acquireProduct = []
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]
      const keyLock = await acquireLock(productId, cartId, quantity)
      acquireProduct.push(keyLock ? true : false)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Một số sản phẩm đã được cập nhật vui lòng quay lại giỏ hàng!')
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new
    })

    return newOrder
  }

  // ---------------------get all order by user--------------------
  static async getOrdersByUser({ userId, cartId }) {

  }

  // ---------------------get one order by user-----------------------
  static async getOneOrderByUser() {

  }

  // ----------------------cancel order by user------------------------
  static async cancelOrderByUser() {

  }

  // ------------------update order status [shop | admin]---------------
  static async updateOrderStatusByShop() {

  }
}

module.exports = CheckoutService