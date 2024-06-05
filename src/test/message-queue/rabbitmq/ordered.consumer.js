'use strict'

const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../../../configs/config')


async function consumerOrderMessage() {
  const connection = await amqp.connect(amqpUri)
  const channel = await connection.createChannel()

  const queueName = 'ordered-queue-message'
  await channel.assertQueue(queueName, {
    durable: true
  })

  // set prefetch to 1 to ensure only one ack at a time
  channel.prefetch(1) // các tác vụ thực hiện công việc tuần tự 1-->2-->3--> ... --> n

  await channel.consume(queueName, msg => {
    const message = msg.content.toString()

    setTimeout(() => {
      console.log(`process:`, message);
      channel.ack(msg)
    }, Math.random() * 1000)
  })

}

consumerOrderMessage().catch(err => console.error(err))