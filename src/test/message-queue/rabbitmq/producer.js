'use strict'


const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../../../configs/config')
const messages = 'New product: Watch'

const runProducer = async () => {
  try {
    const connection = await amqp.connect(amqpUri)
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    // send messages to consumers channel
    channel.sendToQueue(queueName, Buffer.from(messages))
    console.log(`message sent:`, messages);
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)