'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleShop = {
  SHOP: '1',
  WRITER: '2',
  EDITOR: '3',
  ADMIN: '4'
}

class AccessService {

  static signUp = async ({ email, password, name }) => {
    try {
      // 1. check email
      const holderShop = await shopModel.findOne({ email }).lean()
      if (holderShop) {
        return {
          code: 'xxxx',
          message: "Shop already registered!"
        }
      }

      // 2. hash password
      const passwordHash = await bcrypt.hash(password, 10)

      // 3. create new shop
      const newShop = await shopModel.create({
        email, name, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if (newShop) {
        // created privateKey, publicKey
        const publicKey = crypto.randomBytes(64).toString('hex')
        const privateKey = crypto.randomBytes(64).toString('hex')
        console.log({ privateKey, publicKey }); // save collection keyStore

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if (!keyStore) {
          return {
            code: 'xxxx',
            message: "keyStore error"
          }
        }

        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
        console.log(`Created Token Success::`, tokens);

        return {
          code: 201,
          metadata: {
            shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: newShop }),
            tokens
          }
        }
      }

      return {
        code: 201,
        metadata: null
      }

    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }
}

module.exports = {
  AccessService
}