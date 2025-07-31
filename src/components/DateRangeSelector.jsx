"use client";
import * as React from "react";

function DateRangeSelector() {
  const [selectedRange, setSelectedRange] = React.useState("Today");

  const handleChange = (e) => {
    setSelectedRange(e.target.value);
    // Optionally trigger a callback or state update here
  };



  

  return (
    <div className="flex gap-1.5 items-center">
      <label className="text-sm font-semibold leading-5 text-black dark:text-white">
        Select Date Range:
      </label>
      <div className="relative">
        <select
          value={selectedRange}
          onChange={handleChange}
          className="flex gap-2 justify-center items-center px-3 bg-white dark:bg-gray-700 rounded shadow-sm border-[0.82px_solid_rgba(0,0,0,0.07)] h-[25px] text-black dark:text-white">
          <option value="day">Today  </option>
          <option value="This Week">This Week</option>
          <option value="Last Week">Last Week</option>
          <option value="This Month">This Month</option>
          <option value="This Year">This Year</option>
        </select>
      </div>
    </div>
  );
}

export default DateRangeSelector;
