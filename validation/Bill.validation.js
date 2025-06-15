const isEmpty = require('./isEmpty')
const validator = require('validator')

module.exports = function ValidateBill(data) {
  let errors = {}

  data.Supplier = !isEmpty(data.Supplier) ? data.Supplier : ''
  data.Bank = !isEmpty(data.Bank) ? data.Bank : ''
  data.BillNumber = !isEmpty(data.BillNumber) ? data.BillNumber : ''
  data.ReceivingDate = !isEmpty(data.ReceivingDate) ? data.ReceivingDate : ''
  data.BillAmount = !isEmpty(data.BillAmount) ? data.BillAmount : ''
  data.PaycheckNumber = !isEmpty(data.PaycheckNumber) ? data.PaycheckNumber : ''
  data.Amount = !isEmpty(data.Amount) ? data.Amount : ''
  data.PaymentDate = !isEmpty(data.PaymentDate) ? data.PaymentDate : ''

  if (validator.isEmpty(data.Supplier)) {
    errors.Supplier = 'Supplier is required'
  }
  if (validator.isEmpty(data.Bank)) {
    errors.Bank = 'Bank is required'
  }
  if (validator.isEmpty(data.BillNumber)) {
    errors.BillNumber = 'Bill Number is required'
  }
  if (validator.isEmpty(data.ReceivingDate)) {
    errors.ReceivingDate = 'Receiving Date is required'
  }
  if (validator.isEmpty(data.BillAmount)) {
    errors.BillAmount = 'Bill Amount is required'
  }
  if (validator.isEmpty(data.PaycheckNumber)) {
    errors.PaycheckNumber = 'Paycheck Number is required'
  }
  if (validator.isEmpty(data.Amount)) {
    errors.Amount = 'Amount is required'
  }
  if (validator.isEmpty(data.PaymentDate)) {
    errors.PaymentDate = 'Payment Date is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
