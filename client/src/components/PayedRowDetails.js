// components/PayedRowDetails.js
import React from 'react'

function PayedRowDetails({
  Supplier,
  Bank,
  BillNumber,
  ReceivingDate,
  BillAmount,
  PaycheckNumber,
  Amount,
  PaymentDate,
  _id,
  onRestore,
  hideActions,
}) {
  return (
    <tr>
      <td>{Supplier}</td>
      <td>{Bank}</td>
      <td>{BillNumber}</td>
      <td>{new Date(ReceivingDate).toLocaleDateString()}</td>
      <td>{BillAmount}</td>
      <td>{PaycheckNumber}</td>
      <td>{Amount}</td>
      <td>{new Date(PaymentDate).toLocaleDateString()}</td>
      {!hideActions && (
        <td>
          <span
            className="badge bg-warning text-dark"
            style={{ cursor: 'pointer' }}
            onClick={() => onRestore(_id)}
          >
            Restore
          </span>
        </td>
      )}
    </tr>
  )
}

export default PayedRowDetails
