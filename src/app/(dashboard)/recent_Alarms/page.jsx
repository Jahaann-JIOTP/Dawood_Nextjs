"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
//import Preloader from "@/components/Preloader";
import config from "@/config";
const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("today");
  const filters = ["today", "last7days", "last15days", "last30days"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData([]);
      try {
        const response = await axios.get(
          `${config.BASE_URL}/alarms/recent?filter=${filter}`
        );
        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data);
          setError(null);
        } else {
          setError("No alarm data found.");
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Failed to fetch data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (error)
    return <p className="text-center text-red-500 font-semibold">{error}</p>;

  return (
    <div className="relative w-full bg-white shadow-lg h-[39.8vw] max-md:h-[83vh] rounded-lg border-t-4 border-t-[#1F5897] overflow-hidden mt-[-7px]">
      <div
        className="absolute inset-0 bg-[#fdfdfd] dark:bg-gray-800 "
        style={{ opacity: 1 }}></div>

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 z-10 relative">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Alarm History
        </h2>
        <select
          className="block px-4 py-2 text-sm border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F5897] text-gray-700 dark:bg-gray-700 dark:text-white"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}>
          {filters.map((f) => (
            <option key={f} value={f}>
              {f
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^\w/, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto h-[85%] px-4 pb-4 z-10 relative mt-4">
        <table className="min-w-full border border-gray-200 dark:border-gray-400 text-sm rounded-md shadow-sm">
          <thead className="bg-[#1F5897] text-white text-[13px] sticky top-0 z-10">
            <tr>
              {["Source", "Status", "Start Time", "End Time", "Duration"].map(
                (title, i) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold">
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((alarm, index) => {
                const color = alarm.Status?.includes("High")
                  ? "bg-red-500"
                  : alarm.Status?.includes("Low")
                  ? "bg-yellow-400"
                  : "bg-gray-300";

                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-700"
                        : "bg-gray-50 dark:bg-gray-900"
                    } hover:bg-gray-100 transition`}>
                    <td className="px-4 py-2 font-medium relative">
                      <div
                        className={`absolute top-0 left-0 h-full w-1 ${color}`}></div>
                      {alarm.Source || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                      {alarm.Status || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white">
                      {alarm.start_time || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white">
                      {alarm.end_time || "N/A"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-white">
                      {alarm.duration || "N/A"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 dark:text-white">
                  No alarms available for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
