"use client";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const options = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  // { label: "This Week", value: "thisweek" },
  // { label: "Last 7 days", value: "last7days" },
  { label: "This Month", value: "month" },
  // { label: "Last 30 days", value: "last30days" },
  { label: "This Year", value: "year" },
];

const TimePeriodSelector = ({ selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left md:w-auto"
    >
      <div className="flex items-center justify-center md:justify-start gap-2">
        <span className="text-[15.49px] font-raleway font-600">
          Select Date Range:
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[14px] flex items-center cursor-pointer justify-evenly gap-2 w-35 py-[3px] rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
        >
          {options.find((o) => o.value === selected)?.label}
          <HiChevronDown
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1 w-35 rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700">
          <div className="py-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="text-[14px] flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={selected === option.value}
                  onChange={() => {
                    setSelected(option.value);
                    setIsOpen(false);
                  }}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePeriodSelector;
