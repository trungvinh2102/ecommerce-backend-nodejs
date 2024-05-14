'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { HEADER } = require('../contants/index')

// service
const KeyTokenService = require('../services/keyToken.service')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // create accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days"
    })

    // create refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days"
    })

    // verifyToken
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log(`verify error::`, error);
      } else {
        console.log(`decode verify::`, decode);
      }
    })
    return { accessToken, refreshToken }

  } catch (error) {

  }
}

const authentication = asyncHandler(async (req, res, next) => {
  // 1. check userId missing
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) throw new AuthFailureError('Invalid Request!')

  // 2. check keyStore with this userId
  const keyStore = await KeyTokenService.findByUserId(userId)
  if (!keyStore) throw new NotFoundError('Not Found keyStore!')

  //
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      // 4. verifyToken
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
      // 5. check user in database
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      // 6
      return next()
    } catch (error) {
      throw error
    }
  }

  // 3. get accessToken
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new AuthFailureError('Invalid Request!')

  try {
    // 4. verifyToken
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    // 5. check user in database
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore
    // 6
    return next()
  } catch (error) {
    throw error
  }
})

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
}