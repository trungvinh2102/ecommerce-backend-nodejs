'use strict'

const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../configs/config')

const receiveQueue = async ({ address }) => {
  try {
    // 1. create connect
    const connect = await amqp.connect()

    // 2. create channel 
    const channel = await connect.createChannel()

    // 3.create queue name
    const queueName = address
    await channel.assertQueue(queueName, {
      durable: true // false sẽ mất dữ liệu khi server crash
    })

    // 4. send message
    await channel.consume(queueName, msg => {
      console.log(`Msg:: ${msg.content.toString()}`);
    }, {
      noAck: true // xac dinh no chua nhan, default la false, can update true, danh dau da doc
    })
  } catch (error) {
    console.error("receiveQueue ~ error:", error);
  }
}

receiveQueue({ address: 'send-otp-sms' })