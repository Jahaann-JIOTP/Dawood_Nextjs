"use client";

import React from "react";

const thresholdData = [
  {
    tag: "Solar",
    highCurrent: "410 A",
    highVoltage: "440 V",
    lowVoltage: "170 V",
  },
  {
    tag: "WAPDA",
    highCurrent: "288 A",
    highVoltage: "440 V",
    lowVoltage: "170 V",
  },
  {
    tag: "NH3 Compressor 1",
    highCurrent: "173 A",
    highVoltage: "440 V",
    lowVoltage: "170 V",
  },
  {
    tag: "NH3 Compressor 2",
    highCurrent: "75 A",
    highVoltage: "440 V",
    lowVoltage: "170 V",
  },
  {
    tag: "NH3 Compressor 3",
    highCurrent: "217 A",
    highVoltage: "440 V",
    lowVoltage: "170 V",
  },
];

const AlarmThresholdTable = () => {
  return (
    // <div className="relative w-full h-auto rounded-lg h-[43.5vw] max-md:h-[83vh]  mt-[-7px] border-t-4 border-t-[#1F5897] overflow-hidden shadow-md  bg-white ">
      <div className="relative w-full min-h-[81.5vh] rounded-lg mt-[-7px] border-t-4 border-t-[#1F5897] overflow-auto shadow-md bg-white">

      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 ">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Alarm Threshold Values
        </h2>
      </div>

      <div className="overflow-x-auto px-4 py-2 dark:bg-gray-800 ">
        <table className="min-w-full table-auto border border-gray-200 dark:border-none rounded-md shadow-sm">
          <thead className="bg-[#1F5897] text-white text-[13px] sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">High Current Threshold</th>
              <th className="p-3 text-left">High Voltage Threshold</th>
              <th className="p-3 text-left">Low Voltage Threshold</th>
            </tr>
          </thead>
          <tbody>
            {thresholdData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-white dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-900"
                } hover:bg-gray-100 transition`}>
                <td className="p-3 text-sm font-medium text-gray-800 dark:text-white">
                  {item.tag}
                </td>
                <td className="p-3 text-sm">{item.highCurrent}</td>
                <td className="p-3 text-sm">{item.highVoltage}</td>
                <td className="p-3 text-sm">{item.lowVoltage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlarmThresholdTable;
