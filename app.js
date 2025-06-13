var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
require('dotenv').config()

const routerBills = require('./routes/bills')
const authRouter = require('./routes/auth.route')
const supplierRouter = require('./routes/supplier.route')
const bankRoutes = require('./routes/bank.route')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((err) => {
    console.log(err.message)
  })

// ✅ This is now scoped correctly
app.use('/api/bills', routerBills)

app.use('/api/auth', authRouter)
app.use('/api/suppliers', supplierRouter)
app.use('/api/banks', bankRoutes)

module.exports = app
