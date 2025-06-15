import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Alert from '../components/Alert'
import Navbar from '../components/NavBar'
import { PencilFill, Trash3Fill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'

function Supplier() {
  const [form, setForm] = useState({
    SupplierName: '',
    SupplierPhoneNumber: '',
    SupplierAddress: '',
    SupplierTaxCode: '',
  })

  const [suppliers, setSuppliers] = useState([])
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    const res = await axios.get('/api/suppliers')
    setSuppliers(res.data)
  }

  const onChangeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/suppliers', form)
      setMessage('Supplier added successfully')
      setShowAlert(true)
      setForm({
        SupplierName: '',
        SupplierPhoneNumber: '',
        SupplierAddress: '',
        SupplierTaxCode: '',
      })
      fetchSuppliers()
      setTimeout(() => setShowAlert(false), 3000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add supplier')
      setShowAlert(true)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?'))
      return
    try {
      await axios.delete(`/api/suppliers/${id}`)
      setMessage('Supplier deleted')
      setShowAlert(true)
      fetchSuppliers()
      setTimeout(() => setShowAlert(false), 3000)
    } catch (err) {
      setMessage('Failed to delete supplier')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleModify = (id) => {
    navigate(`/supplier/edit/${id}`)
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5" style={{ maxWidth: '960px' }}>
        <h2 className="mb-4 text-danger text-center">Add Supplier</h2>

        {showAlert && <Alert message={message} show={showAlert} />}

        <form onSubmit={onSubmitHandler} className="row g-3 mb-5">
          <div className="col-md-6">
            <label className="form-label">Supplier Name</label>
            <input
              type="text"
              className="form-control"
              name="SupplierName"
              value={form.SupplierName}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              name="SupplierPhoneNumber"
              value={form.SupplierPhoneNumber}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="SupplierAddress"
              value={form.SupplierAddress}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tax Code</label>
            <input
              type="text"
              className="form-control"
              name="SupplierTaxCode"
              value={form.SupplierTaxCode}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-danger w-100 fw-bold">
              Add Supplier
            </button>
          </div>
        </form>

        <h4 className="text-danger mb-3 text-center">Supplier List</h4>

        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center mx-auto w-100">
            <thead className="table-warning">
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Tax Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier._id}>
                  <td>{supplier.SupplierName}</td>
                  <td>{supplier.SupplierPhoneNumber}</td>
                  <td>{supplier.SupplierAddress}</td>
                  <td>{supplier.SupplierTaxCode}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-warning text-white"
                      onClick={() => handleModify(supplier._id)}
                    >
                      <PencilFill /> Modify
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(supplier._id)}
                    >
                      <Trash3Fill /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Supplier
