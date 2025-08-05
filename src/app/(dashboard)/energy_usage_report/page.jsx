"use client";
import config from "@/constant/apiRouteList";
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const page = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [resultShow, setResultShow] = useState(false);
  const [selectedMeters, setSelectedMeters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [energyUsageData, setEnergyUsageData] = useState([]);
  const [formattedData, setFormattedData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || selectedMeters.length === 0) {
      alert("Please fill out all fields including date range and sources.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      alert("End date must be after start date.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${config.BASE_URL}/energy_usage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          meterIds: selectedMeters,
          suffixes: ["Energy_Active_Import_kWh"],
        }),
      });

      const resResult = await response.json();
      if (response.ok) {
        setEnergyUsageData(resResult);
        setFormattedData(formatEnergyDataByDate(resResult));
        setLoading(false);

        setResultShow(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const meters = [
    { id: "M1", name: "Wapda", category: "generation" },
    { id: "M2", name: "Solar", category: "generation" },
  ];
  const generationMeters = meters.filter((m) => m.category === "generation");
  const isGroupFullySelected = (group) =>
    group.every((m) => selectedMeters.includes(m.id));
  /// toggle source model

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  const handleSelectGroup = (group, isChecked) => {
    const groupIds = group.map((m) => m.id);

    setSelectedMeters((prevSelected) => {
      if (isChecked) {
        // Add all group items (avoid duplicates)
        const updated = [...prevSelected, ...groupIds];
        return Array.from(new Set(updated));
      } else {
        // Remove all group items
        return prevSelected.filter((id) => !groupIds.includes(id));
      }
    });
  };
  const handleMeterSelect = (meterId) => {
    const selectedMeter = meters.find((m) => m.id === meterId);
    const selectedCategory = selectedMeter?.category;

    setSelectedMeters((prev) => {
      const isSelected = prev.includes(meterId);
      let updated = [...prev];

      if (isSelected) {
        updated = updated.filter((id) => id !== meterId);
      } else {
        const oppositeCategory =
          selectedCategory === "generation" ? "consumption" : "generation";
        const oppositeMeters = meters
          .filter((m) => m.category === oppositeCategory)
          .map((m) => m.id);
        updated = updated.filter((id) => !oppositeMeters.includes(id));
        updated.push(meterId);
      }

      return updated;
    });
  };

  /////////////////
  const formatEnergyDataByDate = (data) => {
    const grouped = {};

    data.forEach((entry) => {
      const { date, meterId, consumption } = entry;

      if (!grouped[date]) {
        grouped[date] = {};
      }

      if (meterId === "M1") {
        grouped[date].wapda = consumption;
      } else if (meterId === "M2") {
        grouped[date].solar = consumption;
      }
    });

    return Object.entries(grouped)
      .map(([date, values]) => ({
        date,
        wapda: values.wapda ?? "",
        solar: values.solar ?? "",
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // optional sort
  };

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Energy Report", {
      views: [{ showGridLines: false }], // Hide default gridlines
    });

    // Define columns dynamically
    const columns = [
      { header: "Date", key: "date", width: 15 },
      ...(selectedMeters.includes("M1")
        ? [{ header: "Wapda", key: "wapda", width: 15 }]
        : []),
      ...(selectedMeters.includes("M2")
        ? [{ header: "Solar", key: "solar", width: 15 }]
        : []),
    ];
    worksheet.columns = columns;

    // Add table rows
    formattedData.forEach((row) => {
      worksheet.addRow({
        date: row.date,
        wapda: row.wapda || "-",
        solar: row.solar || "-",
      });
    });

    // Apply border & styling to all cells
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        if (rowNumber === 1) {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF1F5897" }, // Header background
          };
        }
      });
    });

    // Generate buffer and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Energy_Report_${startDate}_to_${endDate}.xlsx`);
  };
  return (
    <div className="h-full md:h-[81vh] bg-white dark:bg-gray-800 rounded-md border-t-3 border-[#1F5897]">
      {!resultShow ? (
        <div>
          <div
            id="energy-cost-report"
            className="relative  rounded-2xl  w-full h-[43.5vw] max-md:h-[83vh]mt-[-7px]"
          >
            <div
              className="absolute inset-0  rounded-2xl dark:bg-gray-800"
              style={{ opacity: 1 }}
            />
            <div className="relative  z-10  p-6">
              <h1 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
                Energy Usage Report
              </h1>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[13px] font-bold text-[#626469] dark:text-white mb-2">
                    Sources
                  </label>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="relative w-full p-2 rounded-lg text-[14px] font-bold text-white overflow-hidden border-2"
                    style={{
                      background: "#1F5897",
                      borderColor: "#1F5897",
                      color: "#EFFFFF",
                    }}
                  >
                    <span className="relative z-10">
                      {selectedMeters.length > 0
                        ? `Selected: ${selectedMeters.length} Meters`
                        : "Select Sources"}
                    </span>
                  </button>
                  {selectedMeters.length > 0 && (
                    <div className="mt-2">
                      <label className="block text-[13px] font-bold text-[#626469] dark:text-white">
                        Selected Sources
                      </label>
                      <input
                        type="text"
                        value={selectedMeters
                          .map(
                            (id) =>
                              meters.find((meter) => meter.id === id)?.name
                          )
                          .join(", ")}
                        readOnly
                        className="w-full p-2 border border-[#9f9fa3] rounded-md text-gray-700 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-2">
                    <label className="block text-[13px] font-bold text-[#626469] dark:text-white">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      onFocus={(e) => e.target.showPicker()}
                      className="w-full p-2 border border-[#9f9fa3] rounded-md text-gray-700 dark:bg-gray-700 dark:text-white"
                      max={endDate}
                    />
                  </div>
                  <div className="flex-1 ml-2">
                    <label className="block text-[13px] font-bold text-[#626469] dark:text-white">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      onFocus={(e) => e.target.showPicker()}
                      className="w-full p-2 border border-[#9f9fa3] rounded-md text-gray-700 dark:bg-gray-700 dark:text-white"
                      min={startDate}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-[240px] h-[35px] block font-sans text-[16px] font-bold text-white no-underline uppercase text-center pt-[4px] mt-[10px] ml-[5px] relative cursor-pointer border-none rounded-[5px] bg-[#1f5896]  disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Loading..." : "GENERATE REPORT"}
                  </button>
                </div>
              </form>

              {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-opacity-50"
                    onClick={(e) => {
                      if (e.target === e.currentTarget) setIsModalOpen(false);
                    }}
                  />
                  <div
                    className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl w-[400px] max-w-[90vw] max-h-[80vh] overflow-hidden z-[1010]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-t-lg flex justify-between items-center">
                      <h2 className="text-sm font-bold text-gray-700 dark:text-white">
                        Select Sources
                      </h2>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white p-1 rounded"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 max-h-[300px] overflow-y-auto">
                      <div className="mb-3">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isGroupFullySelected(generationMeters)}
                            onChange={(e) =>
                              handleSelectGroup(
                                generationMeters,
                                e.target.checked
                              )
                            }
                            className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Select All
                          </span>
                        </label>
                      </div>
                      {generationMeters.map((meter) => (
                        <div key={meter.id} className="mb-2">
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMeters.includes(meter.id)}
                              onChange={() => handleMeterSelect(meter.id)}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {meter.name}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end p-4 space-x-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* //////////////////////// */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-700 dark:text-white">
              Energy Usage Report
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setResultShow(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <hr />

          <div className="mb-8">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Invoice To:
                </h2>
                <p className="text-gray-600 dark:text-white">
                  Dawood Floor mills
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
                  Jahaann Technologies
                </h2>
                <p className="text-gray-600 dark:text-white">
                  22-C Block, G.E.C.H.S, Phase 3 Peco Road, Lahore, Pakistan
                </p>
                <p className="text-gray-600 dark:text-white">
                  Phone: +924235949261
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-[2px] bg-gradient-to-r from-[#1F5897] via-green-500 to-red-500 my-4" />

          <div className="mb-4">
            <div className="flex justify-between items-start">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-[#1F5897] text-white rounded-md hover:[#1F5897]"
              >
                Export
              </button>
              <div className="text-right">
                <h2 className="text-lg font-bold text-[#1F5897]">
                  Billing Report
                </h2>
                <div className="text-gray-600 dark:text-white mt-2">
                  <p>Start Date: {startDate}</p>
                  <p>End Date: {endDate}</p>
                </div>
              </div>
            </div>
          </div>
          {/* //////////////////////// */}
          <table className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white">
                <th className="border px-4 py-2">Date</th>
                {selectedMeters.includes("M1") && (
                  <th className="border px-4 py-2">Wapda</th>
                )}
                {selectedMeters.includes("M2") && (
                  <th className="border px-4 py-2">Solar</th>
                )}
              </tr>
            </thead>
            <tbody>
              {formattedData.map((row) => (
                <tr
                  key={row.date}
                  className="text-center text-gray-800 dark:text-white"
                >
                  <td className="border px-4 py-2 bg-[#1F5897] text-white">
                    {row.date}
                  </td>
                  {selectedMeters.includes("M1") && (
                    <td className="border px-4 py-2">
                      {row.wapda !== "" ? row.wapda : "-"}
                    </td>
                  )}
                  {selectedMeters.includes("M2") && (
                    <td className="border px-4 py-2">
                      {row.solar !== "" ? row.solar : "-"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default page;
