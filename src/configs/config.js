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
  },
  aws: {
    aws_bucket_name: process.env.AWS_BUCKET_NAME,
    aws_bucket_access_key: process.env.AWS_BUCKET_ACCESS_KEY,
    aws_bucket_secret_key: process.env.AWS_BUCKET_SECRECT_KEY,
    aws_bucket_clound_front_domain_name: process.env.AWS_BUCKET_CLOUND_FRONT_DOMAIN_NAME,
    aws_bucket_clound_front_key_group: process.env.AWS_BUCKET_CLOUND_FRONT_KEY_GROUP,
    aws_bucket_private_key_id: process.env.AWS_BUCKET_PRIVATE_KEY_ID
  }
}
