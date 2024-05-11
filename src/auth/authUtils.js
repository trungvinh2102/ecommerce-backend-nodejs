'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // create accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
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

module.exports = {
  createTokenPair
}