'use strict'

const { getSelectData, unGetSelectData, convertToObjectIdMongodb } = require('../../utils')
const { product, clothing, electronic, furniture } = require('../product.model')
const { Types, model } = require('mongoose')

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product.find({
    isPublished: true,
    $text: { $search: regexSearch }
  }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .lean()
  return results
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPushlishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()

  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })
  console.log("publishProductByShop ~ foundShop:", foundShop);
  if (!foundShop) return null
  foundShop.isDraft = false
  foundShop.isPublished = true
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id)
  })
  if (!foundShop) return null
  foundShop.isDraft = true
  foundShop.isPublished = false
  const { modifiedCount } = await foundShop.updateOne(foundShop)
  return modifiedCount
}

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew
  })
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

const getProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectIdMongodb(productId) }).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(products.map(async (product) => {
    const foundProduct = await getProductById(product.productId)
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: product.quantity,
        productId: product.productId
      }
    }
  }))
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPushlishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer
}