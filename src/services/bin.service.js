'use strict'

const { NotFoundError } = require("../core/error.response")
const { binDiscount } = require("../models/bin/bin.discount.model")
const { discount } = require("../models/discount.model")
const { checkDiscountExitst } = require("../models/repositories/discount.repo")
const { convertToObjectIdMongodb } = require("../utils")

class BinService {

  // --------------------delete discount-------------------
  static async deleteDiscountCode({ codeId, shopId }) {
    const foundDiscount = await checkDiscountExitst({
      model: binDiscount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })
    if (!foundDiscount) throw new NotFoundError(`Discount doen't exists!`)

    await binDiscount.deleteOne({ _id: foundDiscount._id })
  }

  // -------------------move to discount ------------------
  static async moveToDiscountCode({ shopId, codeId }) {
    const foundDiscount = await checkDiscountExitst({
      model: binDiscount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })
    if (!foundDiscount) throw new NotFoundError(`Discount doen't exists!`)

    const moveToDiscount = await discount.create(foundDiscount)

    if (!moveToDiscount) throw new NotFoundError(`Error moving discount to bin!`)

    await binDiscount.deleteOne({ _id: foundDiscount._id })

    return moveToDiscount
  }

}


module.exports = BinService