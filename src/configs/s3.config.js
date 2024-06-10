'use strict'

const { S3Client } = require('@aws-sdk/client-s3')
const { aws: { aws_bucket_access_key, aws_bucket_secret_key } } = require('./config')

const s3Config = {
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: aws_bucket_access_key,
    secretAccessKey: aws_bucket_secret_key
  }
}


const s3 = new S3Client(s3Config)

module.exports = {
  s3
}
