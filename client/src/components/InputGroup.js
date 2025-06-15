import React from 'react'

function InputGroup({ label, type, name, value, onChangeHandler, errors }) {
  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        className={`form-control ${errors ? 'is-invalid' : ''}`}
        name={name}
        value={value}
        onChange={onChangeHandler}
      />
      {errors && <div className="invalid-feedback d-block">{errors}</div>}
    </div>
  )
}

export default InputGroup
