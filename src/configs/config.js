'use strict'

require('dotenv').config()

module.exports = {
  app: {
    port: process.env.PORT,
  },
  mongodb: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME
  },
  redis: {
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  },
  rabbitmq: {
    amqpUri: process.env.RABBIT_URI
  },
  cloudiary: {
    cloud_name: process.env.CLOUDARY_CLOUND_NAME,
    api_key: process.env.CLOUDARY_API_KEY,
    api_secret: process.env.CLOUDARY_API_SECRET
  }
}
