'use strict'

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {

  //---------------------cart repo--------------------
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateOrInsert = {
        $addToSet: {
          cart_products: product
        }
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateOrInsert, options)
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity
        }
      },
      options = { upsert: true, new: true };
    return await cart.findOneAndUpdate(query, updateSet, options)
  }


  // ---------------add to cart---------------------
  static async addToCart({ userId, product = {} }) {
    const userCart = await cart.findOne({ cart_userId: userId })

    // create user cart
    if (!userCart) {
      return await CartService.createUserCart({ userId, product })
    }

    // add product to cart
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // add quantity if product exitst 
    return await CartService.updateUserCartQuantity({ userId, product })
  }

  //----------------------update cart----------------------
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

    const foundProduct = await getProductById(productId)

    if (!foundProduct) throw new NotFoundError(`Product doen't exitst`)

    // compare
    if (foundProduct.product_shop.toHexString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop')
    }

    if (foundProduct.quantity === 0) {

    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  // ----------------delete cart user-----------------------
  static async deleteItemCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          'cart_products': {
            productId
          }
        }
      }
    const deleteCart = await cart.updateOne(query, updateSet)

    return deleteCart
  }

  //--------------------get list cart-----------------------
  static async getListCart({ userId }) {
    return await cart.findOne({
      cart_userId: +userId
    }).lean()
  }
}

module.exports = CartService