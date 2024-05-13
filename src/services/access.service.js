'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")


// service
const { findByEmail } = require('./shop.service')
const e = require("express")

const RoleShop = {
  SHOP: '1',
  WRITER: '2',
  EDITOR: '3',
  ADMIN: '4'
}

class AccessService {

  // -----------------sign up---------------------------
  static signUp = async ({ email, password, name }) => {
    // 1. check email
    const holderShop = await shopModel.findOne({ email }).lean()
    if (holderShop) throw new BadRequestError('Shop already registered!')

    // 2. hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. create new shop
    const newShop = await shopModel.create({
      email, name, password: passwordHash, roles: [RoleShop.SHOP]
    })

    if (newShop) {
      // 4. created privateKey, publicKey
      const publicKey = crypto.randomBytes(64).toString('hex')
      const privateKey = crypto.randomBytes(64).toString('hex')
      console.log({ privateKey, publicKey }); // save collection keyStore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey
      })

      if (!keyStore) throw new BadRequestError('Error: keyStore error!')

      // 5. generate token
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

      // 6. post data return signup
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

  // -------------------login---------------------------
  static login = async ({ email, password, refreshToken = null }) => {
    // 1. check email in database
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new BadRequestError('Shop Not Registered!')

    // 2. check password
    const match = bcrypt.compare(password, foundShop.password)
    if (!match) throw new AuthFailureError('Authentication Error ')

    // 3. create new accessToken and refreshToken
    const publicKey = crypto.randomBytes(64).toString('hex')
    const privateKey = crypto.randomBytes(64).toString('hex')

    // 4. generate token
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

    // 5. get data return login
    await KeyTokenService.createKeyToken({
      userId,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    })
    return {
      shop: getInfoData({ fileds: ['_id', 'email', 'name'], object: foundShop }),
      tokens
    }
  }

  // --------------------logout-------------------------
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.deleteKeyById(keyStore._id)
    console.log("AccessService ~ logout = ~ delKey:", { delKey });
    return delKey
  }

  // -----------------handler refresh token--------------
  static handleRefreshToken = async (refreshToken) => {

    const foundToken = await KeyTokenService.findByRefreshTokensUsed(refreshToken)
    if (foundToken) {
      // decode check
      const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
      console.log("AccessService ~ handleRefreshToken= ~ { userId, email }::[1]::", { userId, email });

      // delete token in keyStore
      await KeyTokenService.deleteKeyByUserId(userId)
      throw new ForbiddenError('Something wrong happend!! Please relogin');
    }

    // check refresh token
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
    if (!holderToken) throw new AuthFailureError("Shop Not Registered!")

    // verify token
    const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    console.log("AccessService ~ handleRefreshToken= ~ { userId, email }::[2]::", { userId, email });

    // check userId
    const foundShop = await findByEmail({ email })
    if (!foundShop) throw new AuthFailureError("Shop Not Registered!")

    // create new token
    const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken
      }
    })

    return {
      user: { userId, email },
      tokens
    }

  }

}

module.exports = {
  AccessService
}