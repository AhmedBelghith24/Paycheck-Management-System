// routes/supplier.routes.js
const express = require('express')
const router = express.Router()
const Supplier = require('../models/Supplier')

// Create
router.post('/', async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body)
    await newSupplier.save()
    res.json({ message: 'Supplier added successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Read all
router.get('/', async (req, res) => {
  const suppliers = await Supplier.find()
  res.json(suppliers)
})

// Read one (for edit form)
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id)
    if (!supplier)
      return res.status(404).json({ message: 'Supplier not found' })
    res.json(supplier)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching supplier' })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!updatedSupplier)
      return res.status(404).json({ message: 'Supplier not found' })
    res.json(updatedSupplier)
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.id)
  res.json({ message: 'Supplier deleted successfully' })
})

module.exports = router
