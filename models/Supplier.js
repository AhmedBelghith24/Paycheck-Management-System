// models/Supplier.js
const mongoose = require('mongoose')

const supplierSchema = new mongoose.Schema({
  SupplierName: { type: String, required: true },
  SupplierPhoneNumber: { type: String, required: true },
  SupplierAddress: { type: String, required: true },
  SupplierTaxCode: { type: String, required: true },
})

module.exports = mongoose.model('Supplier', supplierSchema)
