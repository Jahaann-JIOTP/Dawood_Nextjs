"use client";

import { useState, useEffect, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
import CustomLoader from "@/components/Customloader/Customloader";

function CustomTrend() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMeter, setSelectedMeter] = useState("");
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showMeters, setShowMeters] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const meterDropdownRef = useRef();
  const parameterDropdownRef = useRef();
  const chartRef = useRef(null);
  const { theme } = useTheme();
  const [chart, setChart] = useState(null);

  const meterMapping = {
    Wapda: "M1_",
    Solar: "M2_",
  };

  const parameterMapping = {
    "Current Demand A": "Current_Demand_A",
    "Reactive Power A": "Reactive_Power_Phase_A_kVAR",
    "Reactive Power B": "Reactive_Power_Phase_B_kVAR",
    "Reactive Power C": "Reactive_Power_Phase_C_kVAR",
    "Apparent Power Phase A": "Apparent_Power_Phase_A_kVA",
    "Apparent Power Phase B": "Apparent_Power_Phase_B_kVA",
    "Apparent Power Phase C": "Apparent_Power_Phase_C_kVA",
    "Active Power Demand": "Active_Power_Demand_kW",
    "Active Power Peak Demand": "Active_Power_Peak_Demand_kW",
    "Reactive Power Demand": "Reactive_Power_Demand_kVAR",
    "Apparent Power Demand": "Apparent_Power_Demand_kVA",
    "Reactive Power Peak Demand kvar": "Reactive_Power_Peak_Demand_kVAR",
    "Apparent Power Peak Demand kva": "Apparent_Power_Peak_Demand_kVA",
    "Energy Active Import kwh": "Energy_Active_Import_kWh",
    "Energy Active Export KWH": "Energy_Active_Export_kWh",
    "Energy Reactive Import": "Energy_Reactive_Import_kVARh",
    "Energy Reactive Export": "Energy_Reactive_Export_kVARh",
    "Energy Apparent Total": "Energy_Apparent_Total_kVAh",
    "Voltage_L-N Phase AV": "Voltage_L-N_Phase_A_V",
    "Voltage_L-N Phase BV": "Voltage_L-N_Phase_B_V",
    "Voltage_L-N Phase CV": "Voltage_L-N_Phase_C_V",
    "Voltage_L-N Average V": "Voltage_L-N_Average_V",
    "Voltage_L-L Phase ABV": "Voltage_L-L_Phase_AB_V",
    "Voltage_L-L Phase BCV": "Voltage_L-L_Phase_BC_V",
    "Voltage L-L Phase CAV": "Voltage_L-L_Phase_CA_V",
    "Voltage L-L Average V": "Voltage_L-L_Average_V",
    "Current Phase_AA": "Current_Phase_A_A",
    "Current Phase_BA": "Current_Phase_B_A",
    "Current Phase_CA": "Current_Phase_C_A",
    "Current Average A": "Current_Average_A",
    "Current Peak Demand A": "Current_Peak_Demand_A",
    "Current 4th InputA": "Current_4th_Input_A",
    FrequencyHz: "Frequency_Hz",
    "Power Factor Total": "Power_Factor_Total",
    "Power Factor Phase A": "Power_Factor_Phase_A",
    "Power Factor Phase B": "Power_Factor_Phase_B",
    "Power Factor Phase C": "Power_Factor_Phase_C",
    "Active Power Total kw": "Active_Power_Total_kW",
    "Reactive Power Total kVAR": "Reactive_Power_Total_kVAR",
    "Apparent Power Total kVA": "Apparent_Power_Total_kVA",
    "Active Power Phase A kW": "Active_Power_Phase_A_kW",
    "Active Power Phase BkW": "Active_Power_Phase_B_kW",
    "Active Power Phase CkW": "Active_Power_Phase_C_kW",
    "Reactive Power Phase A kVAR": "Reactive_Power_Phase_A_kVAR",
    "Reactive Power Phase B kVAR": "Reactive_Power_Phase_B_kVAR",
    "Reactive Power Phase C kVAR": "Reactive_Power_Phase_C_kVAR",
    "Apparent Power Phase A kVA": "Apparent_Power_Phase_A_kVA",
    Apparent_Power_Phase_B_kVA: "Apparent_Power_Phase_B_kVA",
    "Apparent Power Phase C kVA": "Apparent_Power_Phase_C_kVA",
  };

  const meters = Object.keys(meterMapping);
  const parameters = Object.keys(parameterMapping);

  // Chart colors for multiple parameters
  const chartColors = [
    "#00eaff",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
  ];

  const handleParameterSelection = (parameter) => {
    setSelectedParameters((prev) => {
      if (prev.includes(parameter)) {
        return prev.filter((p) => p !== parameter);
      } else {
        if (prev.length >= 8) {
          Swal.fire({
            icon: "error",
            title: "Warning!",
            text: "You can select a maximum of 8 parameters.",
            theme: theme,
            width: "400px",
            height: "auto",
          });
          return prev;
        }
        return [...prev, parameter];
      }
    });
  };

  const handleThemeChange = () => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

      // Fetch data for all selected parameters using only the working API format
      const allParameterData = await Promise.all(
        selectedParameters.map(async (parameter) => {
          const suffixes = parameterMapping[parameter];

          // Only use the working API variation (variation 2 from console)
          const apiUrl = `${baseUrl}/trends?start_date=${startDate}&end_date=${endDate}&meterId=${meterMapping[
            selectedMeter
          ].slice(0, -1)}&suffixes=${suffixes}`;

          try {
            const response = await fetch(apiUrl, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              mode: "cors",
            });

            if (response.ok) {
              const text = await response.text();
              const result = JSON.parse(text);

              const dataArr = Array.isArray(result)
                ? result
                : result.data || result.payload || [];
              const hasNonEmptyData = dataArr.some((entry) => {
                if (entry.data && typeof entry.data === "object") {
                  return Object.keys(entry.data).length > 0;
                }
                return Object.keys(entry).some(
                  (key) => key !== "timestamp" && entry[key] != null
                );
              });

              if (hasNonEmptyData) {
                return {
                  parameter,
                  data: dataArr,
                  suffixes,
                  meterPrefix: meterMapping[selectedMeter],
                };
              }
            }
          } catch (err) {
            console.error(`❌ Error fetching ${parameter}:`, err);
          }

          return {
            parameter,
            data: [],
            suffixes,
            meterPrefix: meterMapping[selectedMeter],
          };
        })
      );

      // Process and combine all parameter data
      const timeMap = new Map();

      allParameterData.forEach(({ parameter, data, suffixes, meterPrefix }) => {
        if (data.length === 0) return;

        data.forEach((entry) => {
          const timestamp = entry.timestamp;
          if (!timestamp) return;

          if (!timeMap.has(timestamp)) {
            timeMap.set(timestamp, {
              Date: new Date(timestamp),
              Time: new Date(timestamp).toLocaleTimeString(),
            });
          }

          const point = timeMap.get(timestamp);
          let value = null;
          const fullKey = `${meterPrefix}${suffixes}`;

          // Strategy 1: Check data object
          if (
            entry.data &&
            typeof entry.data === "object" &&
            Object.keys(entry.data).length > 0
          ) {
            if (entry.data[fullKey] !== undefined) value = entry.data[fullKey];
            else if (entry.data[suffixes] !== undefined)
              value = entry.data[suffixes];
            else if (entry.data[meterPrefix + suffixes] !== undefined)
              value = entry.data[meterPrefix + suffixes];

            // Try partial matches
            if (value === null) {
              const keys = Object.keys(entry.data);
              const foundKey = keys.find(
                (k) =>
                  k.toLowerCase().includes(suffixes.toLowerCase()) ||
                  suffixes.toLowerCase().includes(k.toLowerCase()) ||
                  k.includes(suffixes) ||
                  k.endsWith(suffixes)
              );
              if (foundKey) value = entry.data[foundKey];
            }
          }

          // Strategy 2: Check root level
          if (value === null) {
            if (entry[fullKey] !== undefined) value = entry[fullKey];
            else if (entry[suffixes] !== undefined) value = entry[suffixes];
            else {
              const keys = Object.keys(entry).filter((k) => k !== "timestamp");
              const foundKey = keys.find(
                (k) =>
                  k.toLowerCase().includes(suffixes.toLowerCase()) ||
                  k.includes(suffixes) ||
                  k.endsWith(suffixes)
              );
              if (foundKey) value = entry[foundKey];
            }
          }

          // Convert to number if possible
          if (value !== null && value !== undefined) {
            const numValue = Number.parseFloat(value);
            if (!isNaN(numValue)) {
              value = numValue;
            }
          }

          point[parameter] =
            value !== null && value !== undefined
              ? typeof value === "number"
                ? Number.parseFloat(value.toFixed(2))
                : value
              : null;
        });
      });

      // Convert map to array and sort by date
      const formatted = Array.from(timeMap.values()).sort(
        (a, b) => a.Date - b.Date
      );

      // Check for valid data
      const hasValidData = formatted.some((d) => {
        return selectedParameters.some((param) => {
          const value = d[param];
          return (
            value !== null &&
            value !== undefined &&
            value !== "null" &&
            !isNaN(Number.parseFloat(value))
          );
        });
      });

      if (hasValidData) {
        setChartData(formatted);
      } else {
        setChartData([]);
        console.error(
          `No valid data found for the selected parameters. Please try different parameters or date range.`
        );
      }
    } catch (error) {
      console.error("❌ Error fetching trend data:", error);
      setChartData([]);
      console.error(`Error fetching data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    am4core.useTheme(am4themes_kelly);
    am4core.useTheme(am4themes_animated);
  }, []);

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemeChange);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleThemeChange);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        meterDropdownRef.current &&
        !meterDropdownRef.current.contains(event.target)
      ) {
        setShowMeters(false);
      }
      if (
        parameterDropdownRef.current &&
        !parameterDropdownRef.current.contains(event.target)
      ) {
        setShowParameters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (selectedMeter) {
      handleThemeChange();
    }
  }, [selectedMeter]);

  useEffect(() => {
    if (
      startDate &&
      endDate &&
      selectedMeter &&
      selectedParameters.length > 0
    ) {
      fetchData();
    } else {
      setChartData([]);
    }
  }, [startDate, endDate, selectedMeter, selectedParameters]);

  useEffect(() => {
    // Dispose existing chart before creating new one
    if (chart) {
      chart.dispose();
    }

    if (chartData.length === 0) return;

    const newChart = am4core.create("chartDiv", am4charts.XYChart);
    newChart.logo.disabled = true;
    newChart.data = chartData;
    setChart(newChart);

    const textColor = isDarkMode ? "#ccc" : "#5f5f5f";
    const gridColor = isDarkMode ? "#555" : "#d0d0d0"; // Increased grid visibility

    const dateAxis = newChart.xAxes.push(new am4charts.DateAxis());
    dateAxis.baseInterval = { timeUnit: "hour", count: 1 };
    dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss";
    dateAxis.renderer.grid.template.stroke = am4core.color(gridColor);
    dateAxis.renderer.grid.template.strokeWidth = 1; // Increased grid line width
    dateAxis.renderer.grid.template.strokeOpacity = 0.8; // Increased opacity
    dateAxis.renderer.labels.template.fill = am4core.color(textColor);

    const valueAxis = newChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.fill = am4core.color(textColor);
    valueAxis.renderer.grid.template.stroke = am4core.color(gridColor);
    valueAxis.renderer.grid.template.strokeWidth = 1; // Increased grid line width
    valueAxis.renderer.grid.template.strokeOpacity = 0.8; // Increased opacity
    valueAxis.renderer.labels.template.fill = am4core.color(textColor);

    // Safely add minor grid lines if available
    try {
      if (dateAxis.renderer.minorGrid && dateAxis.renderer.minorGrid.template) {
        dateAxis.renderer.minorGrid.template.stroke = am4core.color(gridColor);
        dateAxis.renderer.minorGrid.template.strokeOpacity = 0.3;
        dateAxis.renderer.minorGrid.template.strokeWidth = 0.5;
      }
    } catch (e) {
      console.error("Minor grid not available for date axis", e);
    }

    try {
      if (
        valueAxis.renderer.minorGrid &&
        valueAxis.renderer.minorGrid.template
      ) {
        valueAxis.renderer.minorGrid.template.stroke = am4core.color(gridColor);
        valueAxis.renderer.minorGrid.template.strokeOpacity = 0.3;
        valueAxis.renderer.minorGrid.template.strokeWidth = 0.5;
      }
    } catch (e) {
      console.error("Minor grid not available for value axis", e);
    }

    // Create series for each selected parameter
    selectedParameters.forEach((parameter, index) => {
      const series = newChart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = "Date";
      series.dataFields.valueY = parameter;
      series.name = `${selectedMeter} - ${parameter}`;
      series.stroke = am4core.color(chartColors[index % chartColors.length]);
      series.strokeWidth = 2;
      series.tooltipText = "{dateX}: [b]{valueY.formatNumber('#.##')}[/]";
      series.show();
    });

    newChart.cursor = new am4charts.XYCursor();
    newChart.scrollbarX = new am4charts.XYChartScrollbar();
    newChart.scrollbarX.minHeight = 15;

    newChart.legend = new am4charts.Legend();
    newChart.legend.position = "bottom";
    newChart.legend.labels.template.fill = am4core.color(textColor);

    // Configure export functionality
    newChart.exporting.menu = new am4core.ExportMenu();
    newChart.exporting.filePrefix = "Customized_Trends";
    newChart.exporting.menu.align = "left";
    newChart.exporting.menu.verticalAlign = "top";
    newChart.exporting.menu.marginRight = 10;

    // Disable unwanted export formats
    newChart.exporting.formatOptions.getKey("json").disabled = true;
    newChart.exporting.formatOptions.getKey("html").disabled = true;
    newChart.exporting.formatOptions.getKey("print").disabled = true;
    newChart.exporting.formatOptions.getKey("pdfdata").disabled = true;

    // Configure PDF export as data export (not image)
    newChart.exporting.formatOptions.getKey("pdf").options = {
      addURL: false,
      fontSize: 10,
      pageOrientation: "landscape",
      pageSize: "A4",
      includeData: true,
      includeImage: false, // Don't include chart image
      title: `Customized Trends Report - ${selectedMeter}`,
      extraText: `Date Range: ${startDate} to ${endDate}\nParameters: ${selectedParameters.join(
        ", "
      )}`,
      tableHeaderBackgroundColor: "#f0f0f0",
      tableAlternateRowBackgroundColor: "#f9f9f9",
    };

    // Configure XLSX export options
    newChart.exporting.formatOptions.getKey("xlsx").options = {
      addColumnNames: true,
      dateFormat: "yyyy-MM-dd HH:mm:ss",
      useTimestamps: false,
      worksheetName: `${selectedMeter}_Trends`,
    };

    // Configure CSV export options
    newChart.exporting.formatOptions.getKey("csv").options = {
      addColumnNames: true,
      dateFormat: "yyyy-MM-dd HH:mm:ss",
      useTimestamps: false,
      delimiter: ",",
    };

    // Customize export menu structure
    newChart.exporting.menu.items = [
      {
        label: "Image",
        menu: [
          { type: "png", label: "PNG" },
          { type: "jpg", label: "JPG" },
          { type: "svg", label: "SVG" },
        ],
      },
      {
        label: "Data",
        menu: [
          {
            type: "pdf",
            label: "PDF",
            options: {
              addURL: false,
              fontSize: 10,
              pageOrientation: "landscape",
              pageSize: "A4",
              includeData: true,
              includeImage: false,
              title: `Customized Trends Report - ${selectedMeter}`,
              extraText: `Date Range: ${startDate} to ${endDate}\nParameters: ${selectedParameters.join(
                ", "
              )}`,
            },
          },
          { type: "xlsx", label: "XLSX" },
          { type: "csv", label: "CSV" },
        ],
      },
    ];

    // Set custom icon for export menu
    newChart.exporting.menu.items[0].icon =
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDYuNy4yIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjUgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZD0iTTY0IDQ2NGMtOC44IDAtMTYtNy4yLTE2LTE2TDQ4IDY0YzAtOC44IDcuMi0xNiAxNi0xNmwxNjAgMCAwIDgwYzAgMTcuNyAxNC4zIDMyIDMyIDMybDgwIDAgMCAyODhjMCA4LjgtNy4yIDE2LTE2IDE2TDY0IDQ2NHpNNjQgMEMyOC43IDAgMCAyOC43IDAgNjRMMCA0NDhjMCAzNS4zIDI4LjcgNjQgNjQgNjRsMjU2IDBjMzUuMyAwIDY0LTI4LjcgNjQtNjRsMC0yOTMuNWMwLTE3LTYuNy0zMy4zLTE4LjctNDUuM0wyNzQuNyAxOC43QzI2Mi43IDYuNyAyNDYuNSAwIDIyOS41IDBMNjQgMHptOTYgMjU2YTMyIDMyIDAgMSAwIC02NCAwIDMyIDMyIDAgMSAwIDY0IDB6bTY5LjIgNDYuOWMtMy00LjMtNy45LTYuOS0xMy4yLTYuOXMtMTAuMiAyLjYtMTMuMiA2LjlsLTQxLjMgNTkuNy0xMS45LTE5LjFjLTIuOS00LjctOC4xLTcuNS0xMy42LTcuNXMtMTAuNiAyLjgtMTMuNiA3LjVsLTQwIDY0Yy0zLjEgNC45LTMuMiAxMS4xLS40IDE2LjJzOC4yIDguMiAxNCA4LjJsNDggMCAzMiAwIDQwIDAgNzIgMGM2IDAgMTEuNC0zLjMgMTQuMi04LjZzMi40LTExLjYtMS0xNi41bC03Mi0xMDR6Ii8+PC9zdmc+";

    // Cleanup function
    return () => {
      if (newChart && !newChart.isDisposed()) {
        newChart.dispose();
      }
    };
  }, [
    chartData,
    isDarkMode,
    selectedMeter,
    selectedParameters,
    startDate,
    endDate,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
    };
  }, [chart]);

  return (
    <div className="relative flex-shrink-0 w-full px-2 py-2 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 h-auto min-h-[500px] lg:h-[81vh] bg-white dark:bg-gray-800 border-t-3 rounded-[8px] shadow-md">
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-base sm:text-lg md:text-xl font-bold font-raleway text-[#1F5897] dark:text-[#D1D5DB]">
            Customized Trend
          </h1>
        </div>

        {/* Form Controls - Responsive Grid */}
        <div className="w-full flex flex-col gap-4 mb-4 sm:mb-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 md:gap-6">
          {/* Start Date */}
          <div className="w-full">
            <label
              className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2"
              style={{ color: "#1F5897" }}
            >
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date */}
          <div className="w-full">
            <label
              className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2"
              style={{ color: "#1F5897" }}
            >
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Select Meter */}
          <div ref={meterDropdownRef} className="relative w-full">
            <label
              className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2"
              style={{ color: "#1F5897" }}
            >
              Select Meter
            </label>
            <button
              onClick={() => {
                setShowMeters(!showMeters);
                setShowParameters(false);
                setSelectedParameters([]);
              }}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded text-left bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            >
              <span className="truncate">
                {selectedMeter || "Select Meter"}
              </span>
              <span className="float-right mt-0.5">
                {showMeters ? "▲" : "▼"}
              </span>
            </button>
            {showMeters && (
              <div className="absolute bg-white dark:bg-gray-800 border shadow-lg z-20 w-full max-h-48 overflow-y-auto dark:text-gray-300 dark:border-gray-600 rounded-md mt-1">
                {meters.map((meter) => (
                  <label
                    key={meter}
                    className="block px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base transition-colors"
                  >
                    <input
                      type="radio"
                      name="meter"
                      value={meter}
                      checked={selectedMeter === meter}
                      onChange={(e) => {
                        setSelectedMeter(e.target.value);
                        setShowMeters(false);
                        setSelectedParameters([]); // Reset parameters when meter changes
                      }}
                      className="mr-2"
                    />
                    {meter}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Select Parameters */}
          <div ref={parameterDropdownRef} className="relative w-full">
            <label
              className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 sm:mb-2"
              style={{ color: "#1F5897" }}
            >
              Select Parameters ({selectedParameters.length}/8)
            </label>
            <button
              onClick={() => {
                setShowParameters(!showParameters);
                if (!selectedMeter) alert("Please select a meter first.");
              }}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded text-left bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={!selectedMeter}
            >
              <span className="truncate">
                {selectedParameters.length > 0
                  ? `${selectedParameters.length} parameter${
                      selectedParameters.length > 1 ? "s" : ""
                    } selected`
                  : "Select Parameters"}
              </span>
              <span className="float-right mt-0.5">
                {showParameters ? "▲" : "▼"}
              </span>
            </button>
            {showParameters && selectedMeter && (
              <div className="absolute bg-white dark:bg-gray-800 border shadow-lg z-20 w-full max-h-48 overflow-y-auto dark:border-gray-600 rounded-md mt-1">
                {parameters.map((param) => (
                  <label
                    key={param}
                    className="block px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 cursor-pointer text-sm sm:text-base transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={param}
                      checked={selectedParameters.includes(param)}
                      onChange={() => handleParameterSelection(param)}
                      className="mr-2"
                    />
                    <span className="break-words">{param}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex-1 w-full relative min-h-0">
          {/* Custom Loader */}
          {loading && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-90 flex items-center justify-center z-10 rounded-md">
              <CustomLoader />
            </div>
          )}

          {/* No Data Message */}
          {chartData.length === 0 && !loading && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 p-4 text-center">
              <div className="text-sm sm:text-base">
                {startDate &&
                endDate &&
                selectedMeter &&
                selectedParameters.length > 0
                  ? "No data available for the selected parameters"
                  : "Kindly select parameter to view chart"}
              </div>
            </div>
          )}

          {/* Chart */}
          <div
            id="chartDiv"
            className="w-full h-full rounded-md bg-white dark:bg-gray-800"
            style={{
              minHeight: "300px",
              maxHeight: "100%",
            }}
          >
            <style jsx>{`
              #chartDiv {
                width: 100% !important;
                height: 100% !important;
              }
              #chartDiv > div {
                width: 100% !important;
                height: 100% !important;
              }

              /* Mobile Devices */
              @media (max-width: 480px) {
                #chartDiv {
                  min-height: 250px !important;
                }
              }

              /* Tablets */
              @media (min-width: 481px) and (max-width: 768px) {
                #chartDiv {
                  min-height: 300px !important;
                }
              }

              /* Small Laptops */
              @media (min-width: 769px) and (max-width: 1024px) {
                #chartDiv {
                  min-height: 350px !important;
                }
              }

              /* Large Screens */
              @media (min-width: 1025px) {
                #chartDiv {
                  min-height: 400px !important;
                }
              }

              /* Extra Large Screens */
              @media (min-width: 1440px) {
                #chartDiv {
                  min-height: 450px !important;
                }
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomTrend;
