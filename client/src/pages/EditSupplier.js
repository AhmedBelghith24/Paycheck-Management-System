// src/pages/EditSupplier.js
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InputGroup from '../components/InputGroup'
import Navbar from '../components/NavBar'

function EditSupplier() {
  const [form, setForm] = useState({
    SupplierName: '',
    SupplierPhoneNumber: '',
    SupplierAddress: '',
    SupplierTaxCode: '',
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
      await axios.put(`/api/suppliers/${id}`, form)
      navigate('/supplier')
    } catch (err) {
      console.error('Error updating supplier:', err)
      setErrors(err.response?.data || {})
    }
  }

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`/api/suppliers/${id}`)
        setForm(res.data)
      } catch (err) {
        console.error('Error fetching supplier:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [id])

  if (loading)
    return <div className="pt-5 mt-5 text-center">Loading supplier data...</div>

  return (
    <div className="container pt-5 mt-5 col-12 col-lg-4">
      <Navbar />
      <form onSubmit={onSubmitHandler}>
        <InputGroup
          label="Supplier Name"
          type="text"
          name="SupplierName"
          onChangeHandler={onChangeHandler}
          errors={errors.SupplierName}
          value={form.SupplierName}
        />
        <InputGroup
          label="Phone Number"
          type="text"
          name="SupplierPhoneNumber"
          onChangeHandler={onChangeHandler}
          errors={errors.SupplierPhoneNumber}
          value={form.SupplierPhoneNumber}
        />
        <InputGroup
          label="Address"
          type="text"
          name="SupplierAddress"
          onChangeHandler={onChangeHandler}
          errors={errors.SupplierAddress}
          value={form.SupplierAddress}
        />
        <InputGroup
          label="Tax Code"
          type="text"
          name="SupplierTaxCode"
          onChangeHandler={onChangeHandler}
          errors={errors.SupplierTaxCode}
          value={form.SupplierTaxCode}
        />
        <button className="btn btn-primary w-100 fw-bold mt-3" type="submit">
          Update Supplier
        </button>
      </form>
    </div>
  )
}

export default EditSupplier
