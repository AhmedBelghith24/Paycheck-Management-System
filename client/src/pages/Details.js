import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InputGroup from '../components/InputGroup'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Navbar from '../components/NavBar'

function Details() {
  const [form, setForm] = useState({})
  const [errors, setErrors] = useState({})
  const [supplierList, setSupplierList] = useState([])
  const [bankList, setBankList] = useState([])
  const { id } = useParams()
  const navigate = useNavigate()

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleDateChange = (name, date) => {
    setForm({
      ...form,
      [name]: date,
    })
  }

  const onSubmitHandler = (e) => {
    e.preventDefault()
    axios
      .put(`/api/bills/${id}`, form)
      .then(() => navigate('/home'))
      .catch((err) => setErrors(err.response.data))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billRes = await axios.get(`/api/bills/${id}`)
        const supplierRes = await axios.get('/api/suppliers')
        const bankRes = await axios.get('/api/banks')

        const receivingDate = billRes.data.ReceivingDate
          ? new Date(billRes.data.ReceivingDate)
          : null
        const paymentDate = billRes.data.PaymentDate
          ? new Date(billRes.data.PaymentDate)
          : null

        setForm({
          ...billRes.data,
          ReceivingDate: isNaN(receivingDate) ? null : receivingDate,
          PaymentDate: isNaN(paymentDate) ? null : paymentDate,
        })

        setSupplierList(supplierRes.data)
        setBankList(bankRes.data)
      } catch (err) {
        console.error('Error fetching bill/suppliers/banks:', err)
      }
    }

    fetchData()
  }, [id])

  return (
    <div className="container pt-5 mt-5 col-12 col-lg-4">
      <Navbar />
      <form onSubmit={onSubmitHandler}>
        {/* Supplier Select */}
        <div className="mb-3">
          <label className="form-label">Supplier</label>
          <select
            className="form-select"
            name="Supplier"
            value={form.Supplier || ''}
            onChange={onChangeHandler}
          >
            <option value="">Select a supplier</option>
            {supplierList.map((s) => (
              <option key={s._id} value={s.SupplierName}>
                {s.SupplierName}
              </option>
            ))}
          </select>
          {errors.Supplier && (
            <div className="invalid-feedback d-block">{errors.Supplier}</div>
          )}
        </div>

        {/* Bank Select */}
        <div className="mb-3">
          <label className="form-label">Bank</label>
          <select
            className="form-select"
            name="Bank"
            value={form.Bank || ''}
            onChange={onChangeHandler}
          >
            <option value="">Select a bank</option>
            {bankList.map((b) => (
              <option key={b._id} value={b.BankName}>
                {b.BankName}
              </option>
            ))}
          </select>
          {errors.Bank && (
            <div className="invalid-feedback d-block">{errors.Bank}</div>
          )}
        </div>

        <InputGroup
          label="Bill Number"
          type="text"
          name="BillNumber"
          onChangeHandler={onChangeHandler}
          errors={errors.BillNumber}
          value={form.BillNumber || ''}
        />

        <div className="mb-3">
          <label className="form-label mb-2">Receiving Date</label>
          <DatePicker
            selected={form.ReceivingDate}
            onChange={(date) => handleDateChange('ReceivingDate', date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            popperPlacement="top"
          />
          {errors.ReceivingDate && (
            <div className="invalid-feedback d-block">
              {errors.ReceivingDate}
            </div>
          )}
        </div>

        <InputGroup
          label="Bill Amount"
          type="text"
          name="BillAmount"
          onChangeHandler={onChangeHandler}
          errors={errors.BillAmount}
          value={form.BillAmount || ''}
        />
        <InputGroup
          label="Paycheck Number"
          type="text"
          name="PaycheckNumber"
          onChangeHandler={onChangeHandler}
          errors={errors.PaycheckNumber}
          value={form.PaycheckNumber || ''}
        />
        <InputGroup
          label="Amount"
          type="text"
          name="Amount"
          onChangeHandler={onChangeHandler}
          errors={errors.Amount}
          value={form.Amount || ''}
        />

        <div className="mb-3">
          <label className="form-label mb-2">Payment Date</label>
          <DatePicker
            selected={form.PaymentDate}
            onChange={(date) => handleDateChange('PaymentDate', date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            popperPlacement="top"
          />
          {errors.PaymentDate && (
            <div className="invalid-feedback d-block">{errors.PaymentDate}</div>
          )}
        </div>

        <button className="btn btn-primary" type="submit">
          Update Bill
        </button>
      </form>
    </div>
  )
}

export default Details
