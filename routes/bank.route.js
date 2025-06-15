// routes/bank.routes.js
const express = require('express')
const router = express.Router()
const Bank = require('../models/Bank')

// Create
router.post('/', async (req, res) => {
  try {
    const newBank = new Bank(req.body)
    await newBank.save()
    res.json({ message: 'Bank added successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Read all
router.get('/', async (req, res) => {
  const banks = await Bank.find()
  res.json(banks)
})

// Read one (for editing)
router.get('/:id', async (req, res) => {
  try {
    const bank = await Bank.findById(req.params.id)
    if (!bank) return res.status(404).json({ message: 'Bank not found' })
    res.json(bank)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bank' })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const updatedBank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!updatedBank) return res.status(404).json({ message: 'Bank not found' })
    res.json(updatedBank)
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  await Bank.findByIdAndDelete(req.params.id)
  res.json({ message: 'Bank deleted successfully' })
})

module.exports = router
