import React from "react";
import bgImage from "../assets/banneer.jpeg";
import "./StationBanner.css";

export default function StationBanner() {
  const stationCoords = "36.7305652,10.251152";
  const embedUrl =
    `https://maps.google.com/maps` +
    `?q=${stationCoords}` +
    `&z=15&output=embed`;
  return (
    <div className="station-banner">
      <img src={bgImage} alt="Shell Station" className="station-banner__img" />

      <div className="station-banner__info">
        <h3>Ezzahra II</h3>

        <div className="station-banner__map-container">
          <iframe
            src={embedUrl}
            allowFullScreen
            loading="lazy"
            title="Carte Ezzahra II"
          />
        </div>

        <p className="station-banner__phone">
          <i className="fas fa-phone-alt me-2"></i>
          +216 29 958 889
        </p>

        <p className="station-banner__hours">
          <i className="far fa-clock me-2"></i>
          Ouvert 24 h/24
        </p>
      </div>
    </div>
  );
}
