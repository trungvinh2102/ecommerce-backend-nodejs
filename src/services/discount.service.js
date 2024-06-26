'use strict'

const { NotFoundError, BadRequestError } = require("../core/error.response")
const { parse, isValid } = require('date-fns');
const { discount } = require("../models/discount.model")
const { checkDiscountExitst, findAllDiscountCodeSelect } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")
const { convertToObjectIdMongodb } = require("../utils");
const { binDiscount } = require("../models/bin/bin.discount.model");

class DiscountService {

  // -------------------create new discount code---------------------
  static async createDiscountCode(payload) {
    const {
      name, description, type, value, code, is_active,
      start_date, end_date, max_uses, uses_count, applies_to,
      users_used, max_uses_per_user, min_order_value, shopId, product_ids
    } = payload

    // Kiểm tra sự tồn tại của start_date và end_date
    if (!start_date || !end_date) {
      throw new BadRequestError('start_date and end_date are required');
    }

    // Chuyển đổi và kiểm tra định dạng ngày tháng
    const startDate = parse(start_date, 'yyyy-MM-dd HH:mm:ss', new Date());
    const endDate = parse(end_date, 'yyyy-MM-dd HH:mm:ss', new Date());

    if (!isValid(startDate) || !isValid(endDate)) {
      throw new BadRequestError('Invalid date format');
    }

    if (startDate >= endDate) {
      throw new BadRequestError(`The start date must be less than the end date`);
    }

    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount exists');
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: startDate,
      discount_end_date: endDate,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    })

    return newDiscount
  }

  // ---------------------update discount code-------------------------
  static async updateDiscountCode(discountId, payload) {
    const {
      name, description, type, value, code, is_active,
      start_date, end_date, max_uses, uses_count, applies_to,
      users_used, max_uses_per_user, min_order_value, shopId, product_ids
    } = payload;

    if (!discountId) throw new BadRequestError(`Discount doen't exist!`);

    if (!start_date || !end_date) {
      throw new BadRequestError('start_date and end_date are required');
    }

    if (start_date && end_date) {
      const startDate = parse(start_date, 'yyyy-MM-dd HH:mm:ss', new Date());
      const endDate = parse(end_date, 'yyyy-MM-dd HH:mm:ss', new Date());

      if (!isValid(startDate) || !isValid(endDate)) {
        throw new BadRequestError('Invalid date form!');
      }

      if (startDate >= endDate) {
        throw new BadRequestError(`The start date must be less than the end date!`);
      }
    }

    const updateFields = {
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_is_active: is_active,
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
    };

    const updatedDiscount = await discount.findByIdAndUpdate(discountId, updateFields, { new: true });

    if (!updatedDiscount) {
      throw new NotFoundError('Discount doe not exitst');
    }

    return updatedDiscount;
  }


  //-----------------get all discount code with product----------------
  static async getAllDiscountCodesWithProduct({ codeId, shopId, limit, page }) {
    const foundDiscount = await discount.findOne({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId)
    }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount not exitst')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let filter
    if (discount_applies_to === 'all') {
      // get all
      filter = {
        product_shop: convertToObjectIdMongodb(shopId),
        isPublished: true
      }
    }

    if (discount_applies_to === 'specific') {
      // get by product ids
      filter = {
        _id: { $in: discount_product_ids },
        isPublished: true
      }
    }

    return await findAllProducts({
      filter,
      limit: +limit,
      page: +page,
      sort: 'ctime',
      select: ['product_name']
    })
  }

  // ------------------get all discount code by shop-------------------
  static async getAllDiscountCodesByShop({ limit, shopId, page }) {
    const discounts = await findAllDiscountCodeSelect({
      model: discount,
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true
      },
      select: ['discount_code', 'discount_name']
    });
    return discounts;
  }

  // ------------------get all discount code by shop-------------------
  static async getDiscountAmount({ codeId, shopId, userId, products }) {
    const foundDiscount = await checkDiscountExitst({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError(`Discount doen't exitst`)
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_users_used,
      discount_max_uses_per_user,
      discount_type,
      discount_value
    } = foundDiscount

    if (!discount_is_active) {
      throw new NotFoundError('Discount expried')
    }

    if (!discount_max_uses) {
      throw new NotFoundError('Discount expried')
    }

    let totalOrder
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(`Discount requires a minium order value of ${discount_min_order_value}`)
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(user => user.userId === userId)
      if (userUsedDiscount) {

      }
    }

    // check amount 
    const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount
    }
  }


  //---------------------move to bin discount code--------------------------
  static async moveToBinDiscountCode({ shopId, codeId }) {
    const foundDiscount = await checkDiscountExitst({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) throw new NotFoundError(`Discount doen't exists!`)

    const moveToBin = await binDiscount.create(foundDiscount)

    if (!moveToBin) throw new NotFoundError(`Error moving discount to bin!`)

    await discount.deleteOne({ _id: foundDiscount._id })

    return moveToBin
  }

  //---------------------cancel discount code-------------------------
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExitst({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId)
      }
    })

    if (!foundDiscount) {
      throw new NotFoundError(`Discount doen't exitst`)
    }

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId
      },
      $inc: {
        discount_max_uses: 1,
        discount_users_count: -1
      }
    })

    return result
  }

}


module.exports = DiscountService