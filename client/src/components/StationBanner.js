import React from 'react'
import bgImage from '../assets/banneer.jpeg' // Ensure this path and image are correct

function StationBanner() {
  return (
    <div className="position-relative text-white" style={{ maxWidth: '100%' }}>
      {/* Background Image with shorter height */}
      <img
        src={bgImage}
        alt="Shell Station"
        className="img-fluid w-100"
        style={{ height: '300px', objectFit: 'cover' }}
      />

      {/* Floating Info Box */}
      <div
        className="position-absolute top-0 start-0 mt-4 ms-4 p-4 rounded shadow"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          maxWidth: '380px',
          borderBottom: '4px solid red',
        }}
      >
        <h3 className="fw-bold">EZZAHRA II</h3>

        <p className="mb-2">
          <i className="fas fa-map-marker-alt me-2"></i>A 22 Route Nationale MC
          39, 2034, Ezzahra, TN
        </p>

        <p className="mb-2">
          <i className="fas fa-phone me-2"></i>
          +216 29 958 889
        </p>

        <p className="fw-bold mb-3">Open 24 Hours</p>

        <button className="btn btn-danger w-100 fw-bold">Get Directions</button>
      </div>
    </div>
  )
}

export default StationBanner
