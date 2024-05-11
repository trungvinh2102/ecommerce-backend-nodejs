'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")

const RoleShop = {
  SHOP: '1',
  WRITER: '2',
  EDITOR: '3',
  ADMIN: '4'
}

class AccessService {

  static signUp = async ({ email, password, name }) => {
    // 1. check email
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) throw new BadRequestError('Error: Shop already registered!')

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

      if (!keyStore) throw new BadRequestError('Error: keyStore error!')

      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

      return {
        metadata: {
          shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: newShop }),
          tokens
        }
      }
    }

    return {
      metadata: null
    }

  }
}

module.exports = {
  AccessService
}