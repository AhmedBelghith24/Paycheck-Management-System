const Bills = require('../models/bill.model')
const ValidateBill = require('../validation/Bill.validation')

const AddBill = async (req, res) => {
  const { errors, isValid } = ValidateBill(req.body)
  try {
    if (!isValid) {
      return res.status(400).json(errors)
    }
    await Bills.create(req.body)
    res.status(201).json({ message: 'Bill added successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error')
  }
}

const FindAllBills = async (req, res) => {
  try {
    const data = await Bills.find()
    res.status(200).json(data)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error')
  }
}

const FindSingleBill = async (req, res) => {
  try {
    const data = await Bills.findById(req.params.id)
    res.status(200).json(data)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error')
  }
}

const UpdateBill = async (req, res) => {
  const { errors, isValid } = ValidateBill(req.body)
  try {
    if (!isValid) {
      return res.status(400).json(errors)
    }
    const data = await Bills.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    res.status(200).json(data)
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error')
  }
}

const DeleteBill = async (req, res) => {
  try {
    await Bills.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'Bill deleted successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).send('Server error')
  }
}

// ✅ GET only unpaid bills
const FindUnpaidBills = async (req, res) => {
  try {
    const unpaid = await Bills.find({ paid: false })
    res.status(200).json(unpaid)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error retrieving unpaid bills', error: err })
  }
}

// ✅ PATCH mark bill as paid
const MarkBillAsPaid = async (req, res) => {
  try {
    const bill = await Bills.findById(req.params.id)
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' })
    }

    bill.paid = true
    await bill.save()

    res.status(200).json({ message: 'Bill marked as paid' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = {
  AddBill,
  FindAllBills,
  FindSingleBill,
  UpdateBill,
  DeleteBill,
  FindUnpaidBills,
  MarkBillAsPaid,
}
