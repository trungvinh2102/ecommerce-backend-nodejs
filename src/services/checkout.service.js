'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById } = require("../models/repositories/cart.repo")
const { checkProductByServer } = require("../models/repositories/product.repo")
const { getDiscountAmount } = require("./discount.service")

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
}

module.exports = CheckoutService