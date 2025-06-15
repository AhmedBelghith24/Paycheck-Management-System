// src/pages/EditBank.js
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InputGroup from '../components/InputGroup'
import Navbar from '../components/NavBar'

function EditBank() {
  const [form, setForm] = useState({
    BankName: '',
    BankAddress: '',
    AgencyHeadName: '',
    AgencyHeadNumber: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`/api/banks/${id}`, form)
      navigate('/bank')
    } catch (err) {
      console.error('Error updating bank:', err)
      setErrors(err.response?.data || {})
    }
  }

  useEffect(() => {
    console.log('Bank ID from URL:', id)
    const fetchBank = async () => {
      try {
        const res = await axios.get(`/api/banks/${id}`)
        setForm(res.data)
      } catch (err) {
        console.error('Error fetching bank:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBank()
  }, [id])

  if (loading)
    return <div className="pt-5 mt-5 text-center">Loading bank data...</div>

  return (
    <div className="container pt-5 mt-5 col-12 col-lg-4">
      <Navbar />
      <form onSubmit={onSubmitHandler}>
        <InputGroup
          label="Bank Name"
          type="text"
          name="BankName"
          onChangeHandler={onChangeHandler}
          errors={errors.BankName}
          value={form.BankName}
        />
        <InputGroup
          label="Bank Address"
          type="text"
          name="BankAddress"
          onChangeHandler={onChangeHandler}
          errors={errors.BankAddress}
          value={form.BankAddress}
        />
        <InputGroup
          label="Agency Head Name"
          type="text"
          name="AgencyHeadName"
          onChangeHandler={onChangeHandler}
          errors={errors.AgencyHeadName}
          value={form.AgencyHeadName}
        />
        <InputGroup
          label="Agency Head Number"
          type="text"
          name="AgencyHeadNumber"
          onChangeHandler={onChangeHandler}
          errors={errors.AgencyHeadNumber}
          value={form.AgencyHeadNumber}
        />
        <button className="btn btn-primary w-100 fw-bold mt-3" type="submit">
          Update Bank
        </button>
      </form>
    </div>
  )
}

export default EditBank
