'use strict'

const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../configs/config')

const sendMessage = async ({ address, msg }) => {
  try {
    // 1. create connect
    const connect = await amqp.connect(amqpUri)

    // 2. create channel
    const channel = await connect.createChannel()

    // 3. create name queue
    const queueName = address
    await channel.assertQueue(queueName, {
      durable: true  // false sẽ mất dữ liệu khi server crash
    })

    // 4. send message
    await channel.sendToQueue(queueName, Buffer.from(msg))

  } catch (error) {
    console.error("sendMessage ~ error:", error);

  }
}

const msg = process.argv.slice(2).join(' ')
sendMessage({ msg: msg, address: 'send-otp-sms' })