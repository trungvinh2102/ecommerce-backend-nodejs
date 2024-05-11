'use srtict'

const moongose = require('mongoose')
const os = require('os')
const process = require('process')

const _SECONDS = 60000

// count connect
const countConnect = () => {
  const numConnection = moongose.connect.length
  console.log(`Number of connections::${numConnection}`);
}

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = moongose.connect.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // Example maximum of connections based on number of cores
    const maxConnections = numCores * 5
    console.log(`Active connection`, numConnection);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024}`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`);
    }

  }, _SECONDS) // monitor 1 minute
}

module.exports = {
  countConnect,
  checkOverload
}