"use client";
import React, { useEffect, useState } from "react";
import { ImArrowDown, ImArrowLeft2 } from "react-icons/im";
import { useRouter } from "next/navigation";
import axios from "axios";
import config from "@/config";

const MeterData = [
  {
    area: "Wapda",
    link: "M1",
    title: "WAPDA",
    top: 435,
    left: 170,
  },
  {
    area: "Solar",
    link: "M2",
    title: "SOLAR",
    top: 435,
    left: 900,
  },
];
const InitalMeterData = () => {
  const [apiData, setApiData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const MeterTags = [
    // Wapda
    {
      activePowerTotalTag: apiData?.M1_Active_Power_Total_kW,
      activeCurrentAvgTag: apiData?.M1_Current_Average_A,
      activeVoltageAvgTag: apiData?.["M1_Voltage_L-L_Phase_CA_V"],
      top: 420,
      left: 176,
    },
    // Solar
    {
      activePowerTotalTag: apiData?.M2_Active_Power_Total_kW,
      activeCurrentAvgTag: apiData?.M2_Current_Average_A,
      activeVoltageAvgTag: apiData?.["M2_Voltage_L-L_Phase_CA_V"],
      top: 420,
      left: 903,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${config.BASE_URL}/nodered/nodered-realtimedata`,
          {
            method: `GET`,
          }
        );
        const resResult = await res.json();
        if (res.ok) {
          setApiData(resResult);
        }
      } catch (err) {
        console.error("API fetch error", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);
  const getVal = (key, unit = "") => {
    return apiData && apiData[key] !== undefined
      ? `${parseFloat(apiData[key]).toFixed(2)} ${unit}`
      : "--";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 h-[81vh] border-t-3 border-[#1f5896] rounded-md overflow-auto">
      <div className="relative w-[1200px] h-[600px] mx-auto">
        {MeterData.map((meter) => (
          <button
            onClick={() =>
              router.push(
                `/meter?area=${meter.area}&U_selections=${meter.link}`
              )
            }
            className="absolute w-[100px] h-[89px] cursor-pointer z-100"
            style={{
              top: meter.top,
              left: meter.left,
            }}
          ></button>
        ))}
        {/* Diagram Image */}
        <img
          src="../../../latestsld.png"
          className="w-[1200px] h-full"
          alt="unit 4 sld"
        />

        {/* Meter Readings */}
        {MeterTags.map((meter, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center justify-around z-40 w-[83px] h-[104px]"
            style={{
              top: `${meter.top}px`,
              left: `${meter.left}px`,
            }}
          >
            <span className="meterReadingUnit4Lt2">
              {meter.activePowerTotalTag || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2">
              {meter.activeCurrentAvgTag || "00.00"}
            </span>
            <span className="meterReadingUnit4Lt2">
              {meter.activeVoltageAvgTag || "00.00"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InitalMeterData;
