import * as React from "react";

function MetricCard({ label, value, color, darkTextColor, className }) {
  return (
    <section
      className="p-3 border-t-3 border-[#1f5897] rounded-md bg-white dark:bg-gray-900 h-max bg-opacity-90"
      style={{ boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}
    >
      <div className="flex flex-col max-sm:gap-1 gap-[0.3vw] items-center">
        <p
          className={`max-sm:text-xs text-[0.7vw] font-medium text-center ${className}`}
          style={{ color: color || "#1F5897" }}
        >
          {label}
        </p>
        <div
          className={`max-sm:text-lg text-[1vw] leading-5 text-black ${
            darkTextColor || "dark:text-[#D1D5DB]"
          }`}
        >
          {value}
        </div>
      </div>
    </section>
  );
}

export default MetricCard;