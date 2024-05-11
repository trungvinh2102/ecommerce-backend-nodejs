require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')
const app = express()

// init middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())

// init database
require('./dbs/init.mongodb')
const { checkOverload } = require('./helpers/check.connect')
checkOverload()

// init router


// handling error


module.exports = app