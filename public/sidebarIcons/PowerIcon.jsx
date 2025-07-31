// components/icons/PowerIcon.tsx
import React from "react";

const PowerIcon = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 13 13"
    fill="currentColor"
    className={className}
  >
    <path
      d="M7.75 11L10.18 6.135H8.5V3L6 7.865H7.75V11ZM8 2C9.375 2 10.55 2.5 11.525 3.475C12.5 4.45 13 5.625 13 7C13 8.375 12.5 9.55 11.525 10.525C10.55 11.5 9.375 12 8 12C6.625 12 5.45 11.5 4.475 10.525C3.5 9.55 3 8.375 3 7C3 5.625 3.5 4.45 4.475 3.475C5.45 2.5 6.625 2 8 2Z"
      fill="currentColor"
    />
  </svg>
);

export default PowerIcon;
