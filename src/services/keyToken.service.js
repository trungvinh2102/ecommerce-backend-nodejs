'use strict'

const { Types } = require("mongoose")
const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {

  // ----------------create new key token---------------
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const filter = { user: userId },
        update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
        options = { upsert: true, new: true }

      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  // ------------------find by userId --------------------
  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: userId })
  }

  // ------------------delete token------------------------
  static deleteKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id).lean()
  }

  // -------------find refresh token used-------------------
  static findByRefreshTokensUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
  }

  // --------------find refresh token -----------------------
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken })
  }

  // --------------- detele key by user id---------------------
  static deleteKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId }).lean()
  }

}

module.exports = KeyTokenService
