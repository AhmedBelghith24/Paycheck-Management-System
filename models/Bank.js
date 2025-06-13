// models/Bank.js
const mongoose = require('mongoose')

const bankSchema = new mongoose.Schema({
  BankName: { type: String, required: true },
  BankAddress: { type: String, required: true },
  AgencyHeadName: { type: String, required: true },
  AgencyHeadNumber: { type: String, required: true },
})

module.exports = mongoose.model('Bank', bankSchema)
