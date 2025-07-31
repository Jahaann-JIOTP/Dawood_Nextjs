"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams, useSearchParams } from "next/navigation";
const overlayMaps = {
  volts: [
    {
      key: "Active_Power_Demand_kW",
      unit: "V ca",
      top: 161,
      left: 30,
      height: 38,
      width: 108,
    },
    {
      key: "Active_Power_Peak_Demand_kW",
      unit: "V bc",
      top: 87,
      left: 182,
      height: 38,
      width: 108,
    },
    {
      key: "Active_Power_Phase_A_kW",
      unit: "V ab",
      top: 182,
      left: 182,
      height: 38,
      width: 108,
    },
    {
      key: "Voltage_L-L_Average_V",
      unit: "V",
      top: 400,
      left: 181,
      height: 38,
      width: 108,
    },
    {
      key: "Current_Phase_A_A",
      unit: "A",
      top: 47,
      left: 319,
      height: 38,
      width: 108,
    },
    {
      key: "Current_Phase_B_A",
      unit: "A",
      top: 139,
      left: 319,
      height: 38,
      width: 108,
    },
    {
      key: "Current_Phase_C_A",
      unit: "A",
      top: 230,
      left: 319,
      height: 38,
      width: 108,
    },
    {
      key: "Current_Average_A",
      unit: "A",
      top: 347,
      left: 319,
      height: 38,
      width: 108,
    },
    {
      key: "Power_Factor_Phase_C",
      unit: "kW",
      top: 47,
      left: 455,
      height: 38,
      width: 108,
    },
    {
      key: "Power_Factor_Phase_B",
      unit: "kW",
      top: 138,
      left: 455,
      height: 38,
      width: 108,
    },
    {
      key: "Power_Factor_Phase_A",
      unit: "kW",
      top: 230,
      left: 455,
      height: 38,
      width: 108,
    },
    {
      key: "Power_Factor_Total",
      unit: "kW",
      top: 300,
      left: 455,
      height: 38,
      width: 108,
    },
    {
      key: "Active_Power_Total_kW",
      unit: "kVAR",
      top: 383,
      left: 455,
      height: 38,
      width: 108,
    },
    {
      key: "Reactive_Power_Demand_kVAR",
      unit: "kVA",
      top: 465,
      left: 455,
      height: 38,
      width: 108,
    },
    {
      key: "Voltage_L-N_Phase_C_V",
      unit: "V an",
      top: 338,
      left: 579,
      height: 38,
      width: 108,
    },
    {
      key: "Voltage_L-N_Phase_B_V",
      unit: "V bn",
      top: 400,
      left: 649,
      height: 38,
      width: 108,
    },
    {
      key: "Voltage_L-N_Phase_A_V",
      unit: "V cn",
      top: 338,
      left: 726,
      height: 38,
      width: 108,
    },
    {
      key: "Frequency_Hz",
      unit: "Hz",
      top: 91,
      left: 849,
      height: 38,
      width: 130,
    },
    {
      key: "Current_AN_Amp",
      unit: "",
      top: 162,
      left: 849,
      height: 38,
      width: 130,
    },
    {
      key: "Power_Factor_Phase_A",
      unit: "",
      top: 235,
      left: 849,
      height: 38,
      width: 130,
    },
    {
      key: "Power_Factor_Phase_B",
      unit: "",
      top: 305,
      left: 849,
      height: 38,
      width: 130,
    },
    {
      key: "Power_Factor_Phase_C",
      unit: "",
      top: 375,
      left: 849,
      height: 38,
      width: 130,
    },
    // { key: "Current_AN_Amp", unit: "", top: 419, left: 900, height: 38,width: 108,},
    {
      key: "Voltage_L-N_Average_V",
      unit: "V",
      top: 447,
      left: 849,
      height: 38,
      width: 130,
    },
  ],
  power: [
    {
      key: "Harmonics_I1_THD",
      unit: "",
      top: 198,
      left: 40,
      height: 38,
      width: 101,
    },
    {
      key: "Harmonics_I2_THD",
      unit: "",
      top: 274,
      left: 41,
      height: 38,
      width: 101,
    },
    {
      key: "Harmonics_I3_THD",
      unit: "",
      top: 351,
      left: 40,
      height: 38,
      width: 101,
    },
    {
      key: "Harmonics_V1_THD",
      unit: "",
      top: 200,
      left: 350,
      height: 38,
      width: 101,
    },
    {
      key: "Harmonics_V2_THD",
      unit: "",
      top: 275,
      left: 350,
      height: 38,
      width: 101,
    },
    {
      key: "Harmonics_V3_THD",
      unit: "",
      top: 352,
      left: 350,
      height: 38,
      width: 101,
    },
    {
      key: "Active_Power_Phase_A_kW",
      unit: "",
      top: 200,
      left: 549,
      height: 38,
      width: 101,
    },
    {
      key: "Active_Power_Phase_B_kW",
      unit: "",
      top: 275,
      left: 549,
      height: 38,
      width: 101,
    },
    {
      key: "Active_Power_Phase_C_kW",
      unit: "",
      top: 352,
      left: 549,
      height: 38,
      width: 101,
    },
    {
      key: "ActivePower_Total_kW",
      unit: "",
      top: 429,
      left: 549,
      height: 38,
      width: 101,
    },
    {
      key: "Reactive_Power_Phase_A_kVAR",
      unit: "",
      top: 200,
      left: 707,
      height: 38,
      width: 101,
    },
    {
      key: "Reactive_Power_Phase_B_kVAR",
      unit: "",
      top: 275,
      left: 707,
      height: 38,
      width: 101,
    },
    {
      key: "ReactivePower_C_kVAR",
      unit: "",
      top: 352,
      left: 707,
      height: 38,
      width: 101,
    },
    {
      key: "ReactivePower_Total_kVAR",
      unit: "",
      top: 429,
      left: 705,
      height: 38,
      width: 101,
    },
    {
      key: "Apparent_Power_Phase_A_kVA",
      unit: "",
      top: 200,
      left: 870,
      height: 38,
      width: 101,
    },
    {
      key: "Apparent_Power_Phase_B_kVA",
      unit: "",
      top: 275,
      left: 870,
      height: 38,
      width: 101,
    },
    {
      key: "Apparent_Power_Phase_C_kVA",
      unit: "",
      top: 352,
      left: 870,
      height: 38,
      width: 101,
    },
    {
      key: "ApparentPower_Total_kVA",
      unit: "",
      top: 429,
      left: 870,
      height: 38,
      width: 101,
    },
  ],
  energy: [
    {
      key: "Energy_Active_Import_kWh",
      unit: "",
      top: 207,
      left: 143,
      height: 35,
      width: 114,
    },
    {
      key: "Energy_Active_Export_kWh",
      unit: "",
      top: 275,
      left: 143,
      height: 35,
      width: 114,
    },
    {
      key: "ActiveEnergy_Total_kWhh",
      unit: "",
      top: 342,
      left: 143,
      height: 35,
      width: 114,
    },
    {
      key: "ActiveEnergy_Total_kWhh",
      unit: "",
      top: 207,
      left: 370,
      height: 35,
      width: 114,
    },
    {
      key: "ActiveEnergy_Total_kWhh",
      unit: "",
      top: 275,
      left: 370,
      height: 35,
      width: 114,
    },
    {
      key: "Energy_Reactive_Export_kVARh",
      unit: "",
      top: 342,
      left: 370,
      height: 35,
      width: 114,
    },
    {
      key: "ActiveEnergy_Total_kWhh",
      unit: "",
      top: 207,
      left: 593,
      height: 35,
      width: 114,
    },
    {
      key: "ActiveEnergy_Total_kWhh",
      unit: "",
      top: 275,
      left: 593,
      height: 35,
      width: 114,
    },
    {
      key: "Energy_Active_Import_kWh",
      unit: "",
      top: 342,
      left: 593,
      height: 35,
      width: 114,
    },
    {
      key: "Energy_Active_Export_kWh",
      unit: "",
      top: 207,
      left: 820,
      height: 35,
      width: 114,
    },
    {
      key: "ActiveEnergy_Total_kWhh",
      unit: "",
      top: 275,
      left: 820,
      height: 35,
      width: 114,
    },
    {
      key: "Energy_Apparent_Total_kVAh",
      unit: "",
      top: 342,
      left: 820,
      height: 35,
      width: 114,
    },
  ],
};
export default function CoolingTowerDashboard() {
  const [apiData, setApiData] = useState(null);
  console.log(apiData);
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("energy");

  const type = searchParams.get("area"); // Get type from query
  const boxId = searchParams.get("U_selections");

  const fetchMeterData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/meter-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          area: type,
          U_selections: boxId,
        }),
      });
      const resResult = await response.json();
      if (response.ok) {
        setApiData(resResult.data);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchMeterData();
    const interval = setInterval(() => {
      fetchMeterData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getVal = (key, unit = "") => {
    const fullKey = `${boxId}_${key}`;
    if (
      !apiData ||
      apiData[fullKey] === undefined ||
      apiData[fullKey] === null
    ) {
      return "NA";
    }
    return `${parseFloat(apiData[fullKey]).toFixed(1)} ${unit}`;
  };

  return (
    <div className="w-full p-4 h-[81vh] rounded-[8px] bg-white dark:bg-gray-800 border-2 border-gray-400 border-t-4 border-t-[#1d5999] overflow-x-auto custom-scrollbar">
      <div className="flex items-center justify-between px-5 mb-4">
        <h3 className="text-2xl font-bold text-[#626469] dark:text-white">
          Meter Diagram
        </h3>

        {/* Button Row */}
        <div className="flex items-center gap-4">
          <img
            src="/back.png"
            alt="Back To Diagram"
            className="h-12 w-auto cursor-pointer hover:grayscale hover:brightness-90 hover:drop-shadow-[0_4px_10px_rgba(33,150,243,0.4)] transition-all duration-300 ease-in-out"
            onClick={() => router.push(`/diagram_sld?type=${type}`)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex justify-center">
        <div className="flex w-[36rem] p-1 items-center gap-1 rounded-[5.544px] bg-[#F9FAFB] shadow-[0px_-0.42px_9px_2px_rgba(2,86,151,0.22)]">
          {["volts", "power", "energy"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-[33px] flex cursor-pointer w-[12rem] items-center justify-center rounded-[5.54px] text-[14px] ${
                activeTab === tab
                  ? "bg-[#025697] text-white"
                  : "bg-[#eef3f5] text-[#303131] border border-[#0000001a]"
              }`}
            >
              {tab === "volts"
                ? "Volts / Amps"
                : tab === "power"
                ? "Power & Power Quality"
                : "Energy"}
            </button>
          ))}
        </div>
      </div>

      {/* Diagram and Overlay */}
      <div className="min-w-[1000px] flex justify-center mt-4">
        <div className="relative w-[1000px] h-[580px]">
          <div
            className="absolute top-[460px] left-0 z-40 flex flex-col items-center cursor-pointer group"
            onClick={() =>
              router.push(
                `/datalogs?type=${type}&boxId=${boxId}&tab=${activeTab}`
              )
            }
            title="View Logs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-9 w-9 p-1 rounded-md shadow-md border transition-all duration-300 ease-in-out
                bg-white fill-[#1d4ed8]
                dark:bg-white dark:fill-[#1d4ed8] border-[#1d4ed8] drop-shadow-[0_4px_10px_rgba(33,150,243,0.4)]
                group-hover:grayscale group-hover:brightness-90 group-hover:drop-shadow-[0_4px_10px_rgba(33,150,243,0.4)]"
            >
              <path d="M5 4v16a1 1 0 001 1h12a1 1 0 001-1V8.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0013.586 2H6a1 1 0 00-1 1zm2 0h6v4a1 1 0 001 1h4v11H7V4zm2 7h6v2H9v-2zm0 4h6v2H9v-2z" />
            </svg>
            <span
              className="text-[10px] mt-1 font-semibold transition-opacity duration-200 
                    text-[#1d4ed8] dark:text-white group-hover:opacity-80"
            >
              Logs
            </span>
          </div>

          {/* Light & Dark Images */}
          {["light", "dark"].map((mode) => (
            <img
              key={`${activeTab}-${mode}`}
              src={`/${activeTab}_${mode}.png`}
              alt={`${activeTab} ${mode}`}
              className={`absolute top-0 left-0 w-full ${
                activeTab === "power" || activeTab === "energy"
                  ? "h-[80%] mt-4"
                  : "h-full"
              } object-contain ${
                mode === "light" ? "dark:hidden" : "hidden dark:block"
              } z-10`}
            />
          ))}

          {/* Overlay Points */}
          {(overlayMaps[activeTab] || []).map(
            ({ key, unit, top, left, height, width }, i) => {
              console.log(top);
              return (
                <div
                  className="absolute flex items-center justify-center z-10 border-1 border-red-500"
                  style={{
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                  }}
                >
                  <p key={i} className="absolute meterDataText">
                    {getVal(key, unit)}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
