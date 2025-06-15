const mongoose = require('mongoose')

const billSchema = new mongoose.Schema(
  {
    Supplier: String,
    Bank: String,
    BillNumber: String,
    ReceivingDate: Date,
    BillAmount: String,
    PaycheckNumber: String,
    Amount: String,
    PaymentDate: Date,
    paid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Bill', billSchema)
