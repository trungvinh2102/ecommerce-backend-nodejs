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
    return await keyTokenModel.findOne({ user: userId }).lean()
  }

  // ------------------remove token------------------------
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne(id)
  }

}

module.exports = KeyTokenService
