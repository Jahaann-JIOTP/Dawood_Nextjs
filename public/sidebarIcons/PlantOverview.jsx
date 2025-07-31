import React from "react";

const PlantOverview = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15"
    height="15"
    viewBox="0 0 13 13"
    fill="currentColor"
    className={className}
  >
    <path
      d="M10.8335 1.625H2.16683C1.56937 1.625 1.0835 2.11087 1.0835 2.70833V10.2917C1.0835 10.8891 1.56937 11.375 2.16683 11.375H10.8335C11.431 11.375 11.9168 10.8891 11.9168 10.2917V2.70833C11.9168 2.11087 11.431 1.625 10.8335 1.625ZM2.16683 10.2917V2.70833H10.8335L10.8346 10.2917H2.16683Z"
      fill="currentColor"
    />
    <path
      d="M3.25 3.7915H9.75V4.87484H3.25V3.7915ZM3.25 5.95817H9.75V7.0415H3.25V5.95817ZM3.25 8.12484H6.5V9.20817H3.25V8.12484Z"
      fill="currentColor"
    />
  </svg>
);

export default PlantOverview;
