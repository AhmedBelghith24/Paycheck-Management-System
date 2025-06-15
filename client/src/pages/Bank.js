import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Alert from '../components/Alert'
import Navbar from '../components/NavBar'
import { PencilFill, Trash3Fill } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'

function Bank() {
  const [form, setForm] = useState({
    BankName: '',
    BankAddress: '',
    AgencyHeadName: '',
    AgencyHeadNumber: '',
  })

  const [banks, setBanks] = useState([])
  const [message, setMessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    const res = await axios.get('/api/banks')
    setBanks(res.data)
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
      await axios.post('/api/banks', form)
      setMessage('Bank added successfully')
      setShowAlert(true)
      setForm({
        BankName: '',
        BankAddress: '',
        AgencyHeadName: '',
        AgencyHeadNumber: '',
      })
      fetchBanks()
      setTimeout(() => setShowAlert(false), 3000)
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add bank')
      setShowAlert(true)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bank?')) return
    try {
      await axios.delete(`/api/banks/${id}`)
      setMessage('Bank deleted')
      setShowAlert(true)
      fetchBanks()
      setTimeout(() => setShowAlert(false), 3000)
    } catch (err) {
      setMessage('Failed to delete bank')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleModify = (id) => {
    navigate(`/bank/edit/${id}`)
  }

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5" style={{ maxWidth: '960px' }}>
        <h2 className="mb-4 text-danger text-center">Add Bank</h2>

        {showAlert && <Alert message={message} show={showAlert} />}

        <form onSubmit={onSubmitHandler} className="row g-3 mb-5">
          <div className="col-md-6">
            <label className="form-label">Bank Name</label>
            <input
              type="text"
              className="form-control"
              name="BankName"
              value={form.BankName}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Bank Address</label>
            <input
              type="text"
              className="form-control"
              name="BankAddress"
              value={form.BankAddress}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Agency Head Name</label>
            <input
              type="text"
              className="form-control"
              name="AgencyHeadName"
              value={form.AgencyHeadName}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Agency Head Number</label>
            <input
              type="text"
              className="form-control"
              name="AgencyHeadNumber"
              value={form.AgencyHeadNumber}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-danger w-100 fw-bold">
              Add Bank
            </button>
          </div>
        </form>

        <h4 className="text-danger mb-3 text-center">Bank List</h4>

        <div className="table-responsive">
          <table className="table table-striped table-bordered text-center mx-auto w-100">
            <thead className="table-warning">
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Agency Head</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banks.map((bank) => (
                <tr key={bank._id}>
                  <td>{bank.BankName}</td>
                  <td>{bank.BankAddress}</td>
                  <td>{bank.AgencyHeadName}</td>
                  <td>{bank.AgencyHeadNumber}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-warning text-white"
                      onClick={() => handleModify(bank._id)}
                    >
                      <PencilFill /> Modify
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(bank._id)}
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

export default Bank
