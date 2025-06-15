// pages/PayedPaycheck.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PayedRowDetails from '../components/PayedRowDetails'
import Navbar from '../components/NavBar'

function PayedPaycheck() {
  const [bills, setBills] = useState([])

  const fetchPaidBills = async () => {
    const res = await axios.get('/api/bills?paid=true')
    setBills(res.data)
  }

  const onRestore = async (id) => {
    await axios.patch(`/api/bills/unmark-paid/${id}`) // create this route
    fetchPaidBills()
  }

  useEffect(() => {
    fetchPaidBills()
  }, [])

  return (
    <div className="p-4">
      <Navbar />
      <h2 className="text-center mb-4">✅ Payed Paychecks</h2>
      <table className="table table-striped">
        <thead className="table-success text-center">
          <tr>
            <th>Supplier</th>
            <th>Bank</th>
            <th>Bill #</th>
            <th>Receiving Date</th>
            <th>Bill Amount</th>
            <th>Paycheck #</th>
            <th>Amount</th>
            <th>Payment Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {bills.map((bill) => (
            <PayedRowDetails
              key={bill._id}
              {...bill}
              onRestore={onRestore}
              hideActions={false}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PayedPaycheck
