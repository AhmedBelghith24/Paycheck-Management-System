import React from 'react'
import { Link } from 'react-router-dom'

function RowDetails({
  Supplier,
  Bank,
  BillNumber,
  ReceivingDate,
  BillAmount,
  PaycheckNumber,
  Amount,
  PaymentDate,
  Id,
  OnDelete,
  onMarkAsPaid,
  paid,
  isSelected,
  onSelect,
}) {
  return (
    <tr>
      <td>
        {!paid && (
          <input type="checkbox" checked={isSelected} onChange={onSelect} />
        )}
      </td>
      <td>{Supplier}</td>
      <td>{Bank}</td>
      <td>{BillNumber}</td>
      <td>{new Date(ReceivingDate).toLocaleDateString()}</td>
      <td>{BillAmount}</td>
      <td>{PaycheckNumber}</td>
      <td>{Amount}</td>
      <td>{new Date(PaymentDate).toLocaleDateString()}</td>
      <td className="d-flex gap-1">
        {paid ? (
          <span className="badge bg-danger">Payed!</span>
        ) : (
          <>
            <span
              className="badge bg-success"
              style={{ cursor: 'pointer' }}
              onClick={() => onMarkAsPaid(Id)}
            >
              <i className="fas fa-check text-white"></i>
            </span>
            <span className="badge bg-warning">
              <Link to={`/bill/edit/${Id}`} className="text-white">
                <i className="fas fa-edit"></i>
              </Link>
            </span>
            <span className="badge bg-danger" onClick={() => OnDelete(Id)}>
              <i className="fas fa-trash-alt"></i>
            </span>
          </>
        )}
      </td>
    </tr>
  )
}

export default RowDetails
