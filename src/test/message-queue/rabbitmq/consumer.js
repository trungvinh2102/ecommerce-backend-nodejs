'use strict'

const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../../../configs/config')

const runConsumer = async () => {
  try {
    const connection = await amqp.connect(amqpUri)
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.consume(queueName, (messages) => {
      console.log(`Received ${messages.content.toString()}`);
    }, {
      ack: false
    })

  } catch (error) {
    console.error(error)
  }
}

runConsumer().catch(console.error)