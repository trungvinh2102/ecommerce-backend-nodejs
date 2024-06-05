'use strict'


const amqp = require('amqplib')
const { rabbitmq: { amqpUri } } = require('../../../configs/config')
const messages = 'New product: Watch'

const log = console.log

console.log = (function () {
  log.apply(console, [new Date()].concat(arguments))
})

const runProducer = async () => {
  try {
    const connection = await amqp.connect(amqpUri)
    const channel = await connection.createChannel()

    const notificationExchange = 'notificationExchange' // direct
    const notificationQueue = 'noticationQueueProcess'
    const notificationExchangeDLX = 'notificationExchangeDLX'
    const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'

    // 1. create exchange
    await channel.assertExchange(notificationExchange, 'direct', {
      durable: true
    })

    // 2. create queue
    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX
    })

    // 3. bind queue
    await channel.bindQueue(queueResult.queue, notificationExchange)

    // 4. send message
    const msg = 'a new product'
    console.log(`Product mgs::`, msg);

    await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
      expiration: '10000'
    })

    setTimeout(() => {
      connection.close()
      process.exit(0)
    }, 500)

  } catch (error) {
    console.error(error)
  }
}

runProducer().then(rs => console.log(rs)).catch(console.error)