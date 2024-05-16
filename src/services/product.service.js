'use strict'

const { BadRequestError } = require('../core/error.response');
const { product, clothing, electronic, furniture, watch } = require('../models/product.model');
const { insertInventory } = require('../models/repositories/inventory.repo');
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPushlishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
} = require('../models/repositories/product.repo');
const { removeUndefindedObject, updateNestedObjectParser } = require('../utils');

class ProductFactory {

  // --------------create new product-----------------
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).createProduct()
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Furniture":
        return new Furniture(payload).createProduct();
      case "Watch":
        return new Watch(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product Types ${type}`)
    }
  }

  // ----------------update product------------------------
  static async updateProduct(type, productId, payload) {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).updateProduct(productId)
      case "Clothing":
        return new Clothing(payload).updateProduct(productId);
      case "Furniture":
        return new Furniture(payload).updateProduct(productId);
      case "Watch":
        return new Watch(payload).createProduct(productId);
      default:
        throw new BadRequestError(`Invalid Product Types ${type}`)
    }
  }

  // -----------------------PUT-----------------------------
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id })
  }

  // ------------------get all draft---------------------
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })

  }

  // --------------------get pulish product------------------
  static async findAllPushlishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPushlishForShop({ query, limit, skip })
  }

  //---------------------search product---------------------
  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }

  // -----------------find all product----------------------
  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({
      limit, sort, filter, page,
      select: ['product_name', 'product_price', 'product_thumb']
    })
  }

  // -----------------find product----------------------
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] })
  }
}


// define base product class
class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_quantity, product_type, product_shop, product_attributes
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  // ---------------create new product-----------------
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id })

    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }

    return newProduct
  }

  //---------------update product-------------------------
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product })
  }
}

// define sub-class for different product type = clothing
class Clothing extends Product {

  // ---------------create new product--------------------
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newClothing) throw new BadRequestError('Create new Clothing error');

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }

  // ------------------update product---------------------
  async updateProduct(productId) {
    // 1. remove attr has null underfined
    const objParams = removeUndefindedObject(this)
    //2. check update
    if (objParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
        model: clothing
      })
    }
    // update parent
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
    return updateProduct
  }
}

// define sub-class for different product type = electronic
class Electronic extends Product {

  // ------------------create new product---------------------
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newElectronic) throw new BadRequestError('Create new Electronic error');

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }

  // ------------------update product---------------------
  async updateProduct(productId) {
    // 1. remove attr has null underfined
    const objParams = removeUndefindedObject(this)
    //2. check update
    if (objParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
        model: electronic
      })
    }
    // update parent
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
    return updateProduct
  }
}

// define sub-class for different product type = furniture
class Furniture extends Product {

  //------------------create new product------------------
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newFurniture) throw new BadRequestError('Create new Furniture error');

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }

  // ------------------update product---------------------
  async updateProduct(productId) {
    // 1. remove attr has null underfined
    const objParams = removeUndefindedObject(this)
    //2. check update
    if (objParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
        model: furniture
      })
    }
    // update parent
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
    return updateProduct
  }
}

// define sub-class for different product type = watch
class Watch extends Product {

  // -------------------create new product----------------
  async createProduct() {
    const newWatch = await watch.create({
      ...this.product_attributes,
      product_shop: this.product_shop
    })
    if (!newWatch) throw new BadRequestError('Create new Furniture error');

    const newProduct = await super.createProduct(newWatch._id)
    if (!newProduct) throw new BadRequestError('Create new Product error')

    return newProduct
  }

  // ------------------update product---------------------
  async updateProduct(productId) {
    // 1. remove attr has null underfined
    const objParams = removeUndefindedObject(this)
    //2. check update
    if (objParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
        model: watch
      })
    }
    // update parent
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
    return updateProduct
  }
}

module.exports = ProductFactory