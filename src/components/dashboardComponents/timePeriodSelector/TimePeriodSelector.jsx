"use client";
import { useEffect, useState } from "react";
import { HiChevronDown } from "react-icons/hi";

const options = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Montly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];
const TimePeriodSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("daily");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center justify-center gap-2">
        <span className="text-[15.49px]" style={{ fontWeight: 600 }}>
          Select Date Range:{" "}
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-evenly gap-2 w-30 py-1 rounded border-1 border-gray-300 dark:border-gray-500 bg-white text-black dark:bg-gray-700 dark:text-white"
        >
          {options.find((o) => o.value === selected)?.label}
          <HiChevronDown />
        </button>
      </div>

      {isOpen && (
        <div className="right-0 absolute z-10 mt-1 w-30 rounded shadow-lg border-1 border-gray-300 dark:border-gray-500 bg-white dark:bg-gray-700  ring-opacity-5">
          <div className="py-1">
            {options.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
