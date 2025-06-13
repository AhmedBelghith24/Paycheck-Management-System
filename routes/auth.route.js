const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Signup route
router.post('/signup', async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create and save new user
    const newUser = new User({
      email,
      password: hashedPassword,
    })

    await newUser.save()

    res.status(201).json({ message: 'User created successfully' })
  } catch (err) {
    console.error('Signup error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Account does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.json({ token, user: { id: user._id, email: user.email } })
  } catch (err) {
    console.error('Login error:', err.message)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
