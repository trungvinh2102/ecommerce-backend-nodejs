'use strict'

const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../../../configs/config')

async function producerOrderMessage() {
  const connection = await amqp.connect(amqpUri)
  const channel = await connection.createChannel()

  const queueName = 'ordered-queue-message'
  await channel.assertQueue(queueName, {
    durable: true
  })

  for (let i = 0; i < 10; i++) {
    const message = `ordered-queue-message::${i}`
    console.log("producerOrderMessage ~ message:", message);
    await channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true
    })
  }

  setTimeout(() => {
    connection.close()
  }, 1000)
}

producerOrderMessage().catch(err => console.error(err))