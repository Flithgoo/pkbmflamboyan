// components/GoogleMap.js

import React from "react";

const GoogleMap = () => {
  return (
    <div className="text-end" style={{ width: "100%", height: "400px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1019.3446726512325!2d109.51952202033378!3d-6.854138978116714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fd96fbf793783%3A0x587867a0c61536c1!2sPKBM%20Flamboyan!5e0!3m2!1sid!2sid!4v1725404156054!5m2!1sid!2sid"
        width="600"
        height="450"
        style={{ border: 0, width: "95%", height: "100%" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default GoogleMap;
