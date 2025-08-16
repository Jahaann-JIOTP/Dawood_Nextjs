"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import Image from "next/image";
import MetricCard from "@/components/MetricCard";
import axios from "axios";
import TimePeriodSelector from "@/components/timePeriodSelector/TimePeriodSelector";
import EnergyEfficiency from "@/components/dashboardComponents/energyEfficienly/EnergyEfficiency";
import TimeBasedEnergyComparison from "@/components/dashboardComponents/timeBasedEnergyComparison/TimeBasedEnergyComparison";
import { useTheme } from "next-themes";
import config from "@/constant/apiRouteList";

const DashboardPage = () => {
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);
  const [dashboardTimePeriod, setDashboardTimePeriod] = useState("today");
  const [realTimeData, setRealTimeData] = useState({});

  const [mounted, setMounted] = useState(false);

  // Apply the animated theme globally
  const applyTheme = () => {
    if (isDark) {
      am4core.useTheme(am4themes_dark);
    } else {
      am4core.unuseTheme(am4themes_dark);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchDashboardData();
    }
  }, [dashboardTimePeriod, mounted]);

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    setDashboardError(null);

    try {
      const response = await fetch(
        `${config.BASE_URL}/dashboard/dashboard-data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range: dashboardTimePeriod,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setDashboardData(result.data || result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setDashboardError(error.message || "Failed to fetch dashboard data");
    } finally {
      setDashboardLoading(false);
    }
  };

  // my api call
  const fetchRealTimeData = async () => {
    try {
      const response = await fetch(
        `${config.BASE_URL}/dashboard/dashboard-data4`,
        {
          method: "GET",
        }
      );
      const resResult = await response.json();
      if (response.ok) {
        setRealTimeData(resResult.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchRealTimeData();
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 5000);
    return ()=> clearInterval(interval)
  }, []);

  // useEffect to fetch data on component mount
  useEffect(() => {
    if (!mounted) {
      fetchDashboardData();

      setMounted(true);
    }
  }, []);

  const secondRowMetrics = [
    {
      label: "WAPDA Import",
      value: dashboardLoading
        ? "Loading..."
        : dashboardError
        ? "Error"
        : `${dashboardData?.M1_Import_Diff || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
    {
      label: "WAPDA Export",
      value: dashboardLoading
        ? "Loading..."
        : dashboardError
        ? "Error"
        : `${dashboardData?.M1_Export_Diff || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
    {
      label: "Solar Generation",
      value: dashboardLoading
        ? "Loading..."
        : dashboardError
        ? "Error"
        : `${dashboardData?.M2_Import_Diff || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
    {
      // label: "Total Generation (Solar + Wapda)",
      label: "Total Generation",
      value: dashboardLoading
        ? "Loading..."
        : dashboardError
        ? "Error"
        : `${dashboardData?.Total_Generation || 0} kW`,
      className: "font-bold",
      color: "#2196F3",
    },
  ];

  // Apply themes at the top level
  useEffect(() => {
    am4core.useTheme(am4themes_animated);
    applyTheme();
  }, [isDark]);

  return (
    <div className="w-full h-[81vh] overflow-auto">
      <section className="flex flex-col sm:p-4 w-full h-[81vh] dark:bg-gray-900 rounded-lg gap-2 sm:gap-4">
        <div className="flex-shrink-0 w-full">
          <TimePeriodSelector
            selected={dashboardTimePeriod}
            setSelected={setDashboardTimePeriod}
          />
        </div>

        {/* Second Row Metrics with API Data */}
        <div className="flex-shrink-0 w-full">
          {dashboardError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <div className="flex justify-between items-center">
                <span>Error loading dashboard data: {dashboardError}</span>
                <button
                  onClick={fetchDashboardData}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          {/* single value div */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {secondRowMetrics.map((metric, index) => (
              <MetricCard
                key={`second-row-${index}`}
                label={metric.label || "00.00"}
                value={metric.value || "00.00"}
                className={`${metric.className} ${
                  dashboardLoading ? "animate-pulse" : ""
                }`}
              />
            ))}
          </div>
        </div>
        {/* charts section */}
        <div className="flex w-full items-center gap-4 justify-between flex-col lg:flex-row">
          <div className="w-full lg:w-[49.4%] ">
            <EnergyEfficiency theme={theme} />
          </div>
          <div className="w-full lg:w-[49.4%]">
            <TimeBasedEnergyComparison theme={theme} />
          </div>
        </div>
        <div className="flex  flex-col gap-2 sm:gap-4 flex-1 w-full">
          <div className="bg-white dark:bg-gray-800 shadow-md border-t-3 border-[#1f5897] rounded-md transition-colors duration-300 flex-1 w-full overflow-hidden flex flex-col">
            <div className="px-2 sm:px-4 py-2  dark:bg-gray-800 flex-shrink-0">
              <h3 className="text-[16px] font-semibold text-[#1F5897] dark:text-[#D1D5DB] transition-colors duration-300">
                Real Time Value
              </h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs sm:text-sm min-w-[320px] h-full">
                <thead className="sticky top-0">
                  <tr className="bg-blue-200 dark:bg-[#1f5897] text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    <th className="px-2 sm:px-4 py-2 text-left font-medium border-r border-gray-300 dark:border-gray-600">
                      Source
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium border-r border-gray-300 dark:border-gray-600">
                      Current Avg (A)
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium border-r border-gray-300 dark:border-gray-600">
                      Voltage L-L Avg (V)
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium border-r border-gray-300 dark:border-gray-600">
                      Total Power (kW)
                    </th>
                    <th className="px-2 sm:px-4 py-2 text-center font-medium">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <td className="px-2 sm:px-4 py-2 border-r border-gray-300 dark:border-gray-600">
                      <div className="flex items-center">
                        <Image
                          src={"/meter.png"}
                          alt="Meter"
                          width={32}
                          height={32}
                          className="border border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-1 sm:ml-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                          Wapda
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                      {realTimeData.M1_Current_Average_A || "0"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                      {realTimeData?.["M1_Voltage_L-L_Average_V"] || "0"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                      {realTimeData.M1_Active_Power_Total_kW || "0"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center">
                      <span
                        className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 ${
                          realTimeData?.["M1_Voltage_L-L_Average_V"] === 0 ||
                          !realTimeData?.["M1_Voltage_L-L_Average_V"]
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {realTimeData?.["M1_Voltage_L-L_Average_V"] === 0 ||
                        !realTimeData?.["M1_Voltage_L-L_Average_V"]
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300">
                    <td className="px-2 sm:px-4 py-2 border-r border-gray-300 dark:border-gray-600">
                      <div className="flex items-center">
                        <Image
                          src={"/meter.png"}
                          alt="Meter"
                          width={32}
                          height={32}
                          className="border border-gray-300 dark:border-gray-600 rounded"
                        />
                        <span className="ml-1 sm:ml-2 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                          Solar
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                      {realTimeData.M2_Current_Average_A || "0"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                      {realTimeData?.["M2_Voltage_L-L_Average_V"] || "0"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center text-gray-900 dark:text-gray-100 border-r border-gray-300 dark:border-gray-600 transition-colors duration-300">
                      {realTimeData.M2_Active_Power_Total_kW || "0"}
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-center">
                      <span
                        className={`inline-block w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 ${
                          realTimeData?.["M2_Voltage_L-L_Average_V"] === 0 ||
                          !realTimeData?.["M2_Voltage_L-L_Average_V"]
                            ? "bg-red-500"
                            : "bg-green-500"
                        }`}
                      ></span>
                      <span className="text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {realTimeData?.["M2_Voltage_L-L_Average_V"] === 0 ||
                        !realTimeData?.["M2_Voltage_L-L_Average_V"]
                          ? "Inactive"
                          : "Active"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
