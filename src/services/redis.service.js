'use strict'

const redis = require('redis')
const { promisify } = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient()

const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const pexpire = promisify(redisClient.pExpire).bind(redisClient);

const acquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10
  const expireTime = 3000;

  for (let i = 0; i < retryTimes.length; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log("acquireLock ~ result:", result);
    if (result === 1) {
      const isReservation = await reservationInventory({
        productId,
        cartId,
        quantity
      })
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      } else {
        // Nếu không đặt chỗ thành công, giải phóng khóa
        await delAsync(key);
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}
