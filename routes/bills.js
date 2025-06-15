const express = require('express')
const router = express.Router()
const Bill = require('../models/Bill')

// GET all bills (with optional ?paid=true)
// router.get('/', async (req, res) => {
//   try {
//     const filter = {}
//     if (req.query.paid === 'true') filter.paid = true
//     if (req.query.paid === 'false') filter.paid = false

//     const bills = await Bill.find(filter)
//     res.json(bills)
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' })
//   }
// })

// router.get('/', async (req, res) => {
//   try {
//     const filter = {}
//     if (req.query.paid === 'true') filter.paid = true
//     if (req.query.paid === 'false') filter.paid = false

//     const bills = await Bill.find(filter)
//     res.json(bills)
//   } catch (err) {
//     console.error('Error in GET /api/bills:', err)
//     res.status(500).json({ error: 'Failed to fetch bills' })
//   }
// })

// // POST new bill
// router.post('/', async (req, res) => {
//   try {
//     const bill = new Bill(req.body)
//     await bill.save()
//     res.json({ message: 'Bill added successfully' })
//   } catch (err) {
//     res.status(400).json({ message: err.message })
//   }
// })

// // PATCH mark bill as paid
// router.patch('/mark-paid/:id', async (req, res) => {
//   try {
//     await Bill.findByIdAndUpdate(req.params.id, { paid: true })
//     res.json({ message: 'Bill marked as paid' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // DELETE bill
// router.delete('/:id', async (req, res) => {
//   try {
//     await Bill.findByIdAndDelete(req.params.id)
//     res.json({ message: 'Bill deleted' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// // PUT update bill
// router.put('/:id', async (req, res) => {
//   try {
//     await Bill.findByIdAndUpdate(req.params.id, req.body)
//     res.json({ message: 'Bill updated' })
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// })

// module.exports = router

// GET all bills or filter by paid status
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.paid === 'true') filter.paid = true
    if (req.query.paid === 'false') filter.paid = false

    const bills = await Bill.find(filter).sort({ createdAt: -1 })
    res.json(bills)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bills' })
  }
})

// GET single bill
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
    if (!bill) return res.status(404).json({ error: 'Bill not found' })
    res.json(bill)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bill' })
  }
})

// POST create new bill
router.post('/', async (req, res) => {
  try {
    const bill = new Bill(req.body)
    await bill.save()
    res.status(201).json({ message: 'Bill created successfully' })
  } catch (err) {
    res.status(400).json(err.errors || { error: 'Failed to create bill' })
  }
})

// PUT update bill
router.put('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!bill) return res.status(404).json({ error: 'Bill not found' })
    res.json(bill)
  } catch (err) {
    res.status(400).json(err.errors || { error: 'Failed to update bill' })
  }
})

// DELETE bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id)
    if (!bill) return res.status(404).json({ error: 'Bill not found' })
    res.json({ message: 'Bill deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bill' })
  }
})

// PATCH mark bill as paid
router.patch('/mark-paid/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paid: true },
      { new: true }
    )
    if (!bill) return res.status(404).json({ error: 'Bill not found' })
    res.json(bill)
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark bill as paid' })
  }
})

// PATCH unmark bill (restore as unpaid)
router.patch('/unmark-paid/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paid: false },
      { new: true }
    )
    if (!bill) return res.status(404).json({ error: 'Bill not found' })
    res.json(bill)
  } catch (err) {
    res.status(500).json({ error: 'Failed to restore bill' })
  }
})

module.exports = router
