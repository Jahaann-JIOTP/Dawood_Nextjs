"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
//import * as XLSX from "xlsx";
//import { saveAs } from "file-saver";
///import Preloader from "@/components/Preloader";
import config from "@/config";

const AlarmTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 14;
  const paginationBtn =
    "px-3 py-2 text-sm rounded-md border border-gray-300  text-white  transition duration-300  bg-[#1F5897]";
  // Utility function to remove duplicates
  const removeDuplicates = (alarms) => {
    const seen = new Set();
    return alarms.filter((alarm) => {
      if (seen.has(alarm._id)) return false;
      seen.add(alarm._id);
      return true;
    });
  };

  // Fetch data periodically using useEffect
  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${config.BASE_URL}/alarms`) // Update to your backend API URL
        .then((response) => {
          const alarms = response.data?.alarms || [];
          const formattedAlarms = alarms.map((alarm) => ({
            _id: alarm._id, // required for uniqueness
            state: alarm.end_time ? "Inactive" : "Active", // sets state based on end_time
            Source: alarm.Source,
            Status: alarm.status1,
            Time: alarm.current_time,
            alarm_count: alarm.alarm_count,
          }));

          const uniqueData = removeDuplicates(formattedAlarms);
          setData(uniqueData);
          setLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (error) return <p className="text-center text-red-500">{error}</p>;

  const getStatusDetails = (status) => {
    if (status === "Low Voltage" || status === "Low Current") {
      return { color: "bg-yellow-400", image: "/yellow.png" };
    }
    if (status === "High Voltage" || status === "High Current") {
      return { color: "bg-red-500", image: "/red.png" };
    }
    return { color: "bg-green-500", image: null };
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const exportToExcel = () => {
    const exportData = data.map((item) => ({
      State: item.state || "N/A",
      Source: item.Source || "N/A",
      Status: item.Status || "N/A",
      LastOccurrence: item.Time ? new Date(item.Time).toLocaleString() : "N/A",
      Occurrences: item.alarm_count || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alarms");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelFile, "alarms_data.xlsx");
  };

  return (
    <div className="relative w-full h-[43vw] max-md:h-[83vh]  mt-[-7px] rounded-lg border-t-4 border-t-[#1F5897] overflow-hidden shadow-md mt-[-7px]">
      {/* Header */}
      <div
        className="absolute inset-0 bg-[#fff] dark:bg-gray-800"
        style={{ opacity: 1 }}></div>
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 z-10 relative">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          All Historical Alarms
        </h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-md shadow hover:from-blue-600 hover:to-blue-800 transition">
          Export to Excel
        </button>
      </div>

      <br />
      <br />

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto h-[28vw] px-4 z-10 relative">
        <table className="min-w-full table-auto border border-gray-200 rounded-md shadow-sm">
          <thead className="bg-[#1F5897] text-white text-[13px] sticky top-0 z-10">
            <tr>
              {[
                "State",
                "Source",
                "Status",
                "Last Occurrence",
                "Occurrences",
              ].map((title, index) => (
                <th key={index} className="p-3 text-left font-semibold">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((item, index) => {
              const { color, image } = getStatusDetails(item.Status);
              return (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-gray-100 transition`}>
                  <td className="p-3 text-sm flex items-center relative">
                    <div
                      className={`h-full w-1 absolute top-0 left-0 ${color}`}
                    />
                    {image && (
                      <img src={image} alt="status" className="w-4 h-4 mr-2" />
                    )}
                    {item.state || "N/A"}
                  </td>
                  <td className="p-3 text-sm">{item.Source || "N/A"}</td>
                  <td className="p-3 text-sm">{item.Status || "N/A"}</td>
                  <td className="p-3 text-sm">
                    {item.Time ? new Date(item.Time).toLocaleString() : "N/A"}
                  </td>
                  <td className="p-3 text-sm">{item.alarm_count || 0}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {[
            {
              label: "First",
              disabled: currentPage === 1,
              onClick: () => handlePageChange(1),
            },
            {
              label: "Previous",
              disabled: currentPage === 1,
              onClick: () => handlePageChange(currentPage - 1),
            },
            {
              label: "Next",
              disabled: currentPage === totalPages,
              onClick: () => handlePageChange(currentPage + 1),
            },
            {
              label: "Last",
              disabled: currentPage === totalPages,
              onClick: () => handlePageChange(totalPages),
            },
          ].map(({ label, disabled, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              disabled={disabled}
              className={`${paginationBtn} ${
                disabled ? "opacity-90 cursor-not-allowed" : ""
              } `}>
              {label}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600">
          Page{" "}
          <span className="font-medium text-[#1F5897] ">{currentPage}</span> of{" "}
          <span className="font-medium text-[#1F5897]">{totalPages}</span>
        </p>
      </div>
    </div>
  );
};

export default AlarmTable;
