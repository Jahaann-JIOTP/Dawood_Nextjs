"use client";
import config from "@/constant/apiRouteList";
import { useSearchParams, useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
// import CustomLoader from "/components/customLoader/CustomLoader";
import Swal from "sweetalert2";

const LogDetails = () => {
  const [meterLogsData, setMeterLogsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const searchParams = useSearchParams();
  // const area = searchParams.get("area");
  const type = searchParams.get("val");
  const meter_id = searchParams.get("meter_id");
  const meterName = searchParams.get("meter-name");
  const router = useRouter();

  // const getMeterLogsData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       `${config.BASE_URL}${config.DIAGRAM.LOGS_DATA}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           type,
  //           meters: meter_id,
  //           start_date: startDate,
  //           end_date: endDate,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //       const resResult = await response.json();
  //       setMeterLogsData(resResult.data);
  //       setLoading(false);
  //     } else {
  //       console.error("Failed to fetch logs:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   }
  // };
const getMeterLogsData = async () => {
  setLoading(true);
  try {
    const queryParams = new URLSearchParams({
      type,
      meters: meter_id,
      start_date: startDate,
      end_date: endDate,
    });

    const response = await fetch(
      `${config.BASE_URL}${config.DIAGRAM.LOGS_DATA}?${queryParams.toString()}`
    );

    if (response.ok) {
      const resResult = await response.json();
      setMeterLogsData(resResult.data);
    } else {
      console.error("Failed to fetch logs:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    setLoading(false);
  }
};




  useEffect(() => {
    getMeterLogsData();
  }, [startDate, endDate]);

  const columns = Array.from(
    new Set(
      meterLogsData
        .flatMap((row) => Object.keys(row))
        .filter((key) => key !== "meterId")
    )
  );
  const exportToExcel = async () => {
    if (meterLogsData.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No data to export!",
        theme: theme,
      });
      return;
    }

    try {
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Meter Logs");

      // Step 1: Prepare export data
      const exportData = meterLogsData.map((row) => {
        const newRow = {};
        columns.forEach((col) => {
          if (col === "time") {
            newRow["Date"] = new Date(row[col]).toLocaleDateString();
            newRow["Time"] = new Date(row[col]).toLocaleTimeString();
          } else {
            newRow[col.replace(/_/g, " ")] =
              typeof row[col] === "number"
                ? Math.abs(row[col]) > 1e9
                  ? 0
                  : Math.round(row[col] * 100) / 100
                : row[col] == null
                ? 0
                : row[col];
          }
        });
        return newRow;
      });

      const columnNames = Object.keys(exportData[0]);
      const columnCount = columnNames.length;
      // row height
      worksheet.getRow(1).height = 30;
      worksheet.getRow(2).height = 30;
      worksheet.getRow(3).height = 30;

      // Step 2: Add title rows
      // Merge cells for title rows
      worksheet.mergeCells(1, 1, 1, columnCount); // A1 across all columns
      worksheet.mergeCells(2, 1, 2, columnCount); // A2 across all columns

      // Add meter name title (A1)
      const title1 = worksheet.getCell(1, 1);
      title1.value = `Meter Name: ${meterName?.toUpperCase()}`;
      title1.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
      title1.alignment = { horizontal: "center", vertical: "middle" };
      title1.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cedef0" },
      };

      // Add log type title (A2)
      const title2 = worksheet.getCell(2, 1);
      title2.value = `Log Type: ${type?.toUpperCase()}`;
      title2.font = { bold: true, size: 16, color: { argb: "FF1D5999" } };
      title2.alignment = { horizontal: "center", vertical: "middle" };
      title2.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "cedef0" },
      };
      title2.border = {
        top: { style: "thin", color: { argb: "3A83C6" } },
      };

      // Step 3: Add headers (row 3)
      const headerRow = worksheet.getRow(3);
      headerRow.values = columnNames;

      // Style header row
      headerRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF1D5999" },
        };
        cell.height = {};
        cell.border = {
          top: { style: "thin", color: { argb: "cedef0" } },
          bottom: { style: "thin", color: { argb: "cedef0" } },
          left: { style: "thin", color: { argb: "cedef0" } },
          right: { style: "thin", color: { argb: "cedef0" } },
        };
      });

      // Step 4: Add data rows
      exportData.forEach((row, rowIndex) => {
        const dataRow = worksheet.addRow(Object.values(row));

        // Style data cells (center alignment)
        dataRow.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        });
      });

      // Step 5: Set column widths
      worksheet.columns = columnNames.map(() => ({ width: 20 }));

      // Step 6: Generate and download the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(
        blob,
        `meter_logs_${meterName}_${type}_${startDate}_to_${endDate}.xlsx`
      );
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "An error occurred while exporting to Excel",
      });
    }
  };
  return (
    <div className="h-[81vh] bg-white dark:bg-gray-800 border-t-3 border-[#1D5999] rounded-md px-5 py-2">
      <h1 className="font-700 font-inter text-[24px]">
        Meter Logs - <span className="uppercase text-[#1D5999]">{type}</span>
      </h1>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center justify-start gap-5">
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="focus:outline-none border-1 border-gray-300 dark:border-gray-500 px-2 py-1 rounded"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endtDate"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="focus:outline-none border-1 border-gray-300 dark:border-gray-500 px-2 py-1 rounded"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={exportToExcel}
            className="px-3 py-2 rounded-sm bg-gradient-to-r from-[#22C35D] to-[#15813D] text-white text-[16px] font-400 font-inter hover:scale-103 transition-all duration-500 cursor-pointer"
          >
            Export excel
          </button>
          <button
            onClick={() => router.back()}
            className="px-3 py-2 rounded-sm bg-gradient-to-r from-[#989FAC] to-[#4E5765] text-white text-[16px] font-400 font-inter hover:scale-103 transition-all duration-500 cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
      <div className="mt-8">
        {/* {loading ? (
          <CustomLoader />
        ) : ( */}
          <div className="rounded overflow-hidden border border-gray-300">
            <div className="max-h-[63vh] overflow-y-auto custom-scrollbar-report">
              <table className="w-full border-collapse table-fixed">
                <thead className=" text-white sticky top-0 z-10">
                  <tr className="bg-[#1D5999] border-t-2 border-[#1D5999]">
                    {columns.flatMap((col, index) => {
                      if (col === "time") {
                        return [
                          <th
                            key={`date-${index}`}
                            className="border border-gray-300 px-3 py-2 text-sm font-semibold capitalize text-center"
                          >
                            Date
                          </th>,
                          <th
                            key={`time-${index}`}
                            className="border border-gray-300 px-3 py-2 text-sm font-semibold capitalize text-center"
                          >
                            Time
                          </th>,
                        ];
                      } else {
                        return (
                          <th
                            key={`col-${index}`}
                            className="border border-gray-300 px-3 py-2 text-sm font-semibold capitalize text-center"
                          >
                            {col.replace(/_/g, " ")}
                          </th>
                        );
                      }
                    })}
                  </tr>
                </thead>
                <tbody>
                  {meterLogsData.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {columns.map((col, colIdx) =>
                        col === "time" ? (
                          [
                            <td
                              key={`${rowIdx}-date-${colIdx}`}
                              className="border border-gray-200 px-3 py-1 text-center text-sm"
                            >
                              {new Date(row[col]).toLocaleDateString()}
                            </td>,
                            <td
                              key={`${rowIdx}-time-${colIdx}`}
                              className="border border-gray-200 px-3 py-1 text-center text-sm"
                            >
                              {new Date(row[col]).toLocaleTimeString()}
                            </td>,
                          ]
                        ) : (
                          <td
                            key={`${rowIdx}-${col}-${colIdx}`}
                            className="border border-gray-200 px-3 py-1 text-center text-sm"
                          >
                            {typeof row[col] === "number"
                              ? Math.abs(row[col]) > 1e9
                                ? 0
                                : Math.round(row[col] * 100) / 100
                              : row[col] == null
                              ? 0
                              : row[col]}
                          </td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default LogDetails;
