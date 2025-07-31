  "use client";

  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { useRouter, useParams, useSearchParams } from 'next/navigation';
  const overlayMaps = {
    volts: [
      { key: "Active_Power_Demand_kW", unit: "V ca", top: 171, left: 45 },
      { key: "Active_Power_Peak_Demand_kW", unit: "V bc", top: 98, left: 205 },
      { key: "Active_Power_Phase_A_kW", unit: "V ab", top: 194, left: 205 },
      { key: "Voltage_L-L_Average_V", unit: "V", top: 411, left: 215 },
      { key: "Current_Phase_A_A", unit: "A", top: 58, left: 352 },
      { key: "Current_Phase_B_A", unit: "A", top: 149, left: 352 },
      { key: "Current_Phase_C_A", unit: "A", top: 241, left: 352 },
      { key: "Current_Average_A", unit: "A", top: 359, left: 352 },
      { key: "Power_Factor_Phase_C", unit: "kW", top: 58, left: 485 },
      { key: "Power_Factor_Phase_B", unit: "kW", top: 149, left: 485 },
      { key: "Power_Factor_Phase_A", unit: "kW", top: 241, left: 485 },
      { key: "Power_Factor_Total", unit: "kW", top: 312, left: 485 },
      { key: "Active_Power_Total_kW", unit: "kVAR", top: 395, left: 485 },
      { key: "Reactive_Power_Demand_kVAR", unit: "kVA", top: 477, left: 485 },
      { key: "Voltage_L-N_Phase_C_V", unit: "V an", top: 348, left: 600 },
      { key: "Voltage_L-N_Phase_B_V", unit: "V bn", top: 410, left: 670 },
      { key: "Voltage_L-N_Phase_A_V", unit: "V cn", top: 348, left: 748 },
      { key: "Frequency_Hz", unit: "Hz", top: 105, left: 890 },
      { key: "Current_AN_Amp", unit: "", top: 175, left: 900 },
      { key: "Power_Factor_Phase_A", unit: "", top: 250, left: 900 },
      { key: "Power_Factor_Phase_B", unit: "", top: 320, left: 900 },
      { key: "Power_Factor_Phase_C", unit: "", top: 385, left: 900 },
      // { key: "Current_AN_Amp", unit: "", top: 419, left: 900 },
      { key: "Voltage_L-N_Average_V", unit: "V", top: 460, left: 893 },
    ],
    power: [
      { key: "Harmonics_I1_THD", unit: "", top: 210, left: 79 },
      { key: "Harmonics_I2_THD", unit: "", top: 285, left: 79 },
      { key: "Harmonics_I3_THD", unit: "", top: 362, left: 79 },
      { key: "Harmonics_V1_THD", unit: "", top: 210, left: 391 },
      { key: "Harmonics_V2_THD", unit: "", top: 285, left: 391 },
      { key: "Harmonics_V3_THD", unit: "", top: 362, left: 391 },
      { key: "Active_Power_Phase_A_kW", unit: "", top: 210, left: 589 },
      { key: "Active_Power_Phase_B_kW", unit: "", top: 285, left: 589 },
      { key: "Active_Power_Phase_C_kW", unit: "", top: 362, left: 589 },
      { key: "ActivePower_Total_kW", unit: "", top: 439, left: 589 },
      { key: "Reactive_Power_Phase_A_kVAR", unit: "", top: 210, left: 742 },
      { key: "Reactive_Power_Phase_B_kVAR", unit: "", top: 285, left: 742 },
      { key: "ReactivePower_C_kVAR", unit: "", top: 362, left: 742 },
      { key: "ReactivePower_Total_kVAR", unit: "", top: 439, left: 742 },
      { key: "Apparent_Power_Phase_A_kVA", unit: "", top: 210, left: 912 },
      { key: "Apparent_Power_Phase_B_kVA", unit: "", top: 285, left: 912 },
      { key: "Apparent_Power_Phase_C_kVA", unit: "", top: 362, left: 912 },
      { key: "ApparentPower_Total_kVA", unit: "", top: 439, left: 912 },
    ],
    energy: [
      { key: "Energy_Active_Import_kWh", unit: "", top: 210, left: 192 },
      { key: "Energy_Active_Export_kWh", unit: "", top: 290, left: 170 },
      { key: "ActiveEnergy_Total_kWhh", unit: "", top: 355, left: 185 },
      { key: "ActiveEnergy_Total_kWhh", unit: "", top: 220, left: 399 },
      { key: "ActiveEnergy_Total_kWhh", unit: "", top: 290, left: 420 },
      { key: "Energy_Reactive_Export_kVARh", unit: "", top: 355, left: 400 },
      { key: "ActiveEnergy_Total_kWhh", unit: "", top: 220, left: 620 },
      { key: "ActiveEnergy_Total_kWhh", unit: "", top: 285, left: 635 },
      { key: "Energy_Active_Import_kWh", unit: "", top: 350, left: 640 },
      { key: "Energy_Active_Export_kWh", unit: "", top: 220, left: 835 },
      { key: "ActiveEnergy_Total_kWhh", unit: "", top: 290, left: 860 },
      { key: "Energy_Apparent_Total_kVAh", unit: "", top: 354, left: 855 },
    ]
  };
  export default function CoolingTowerDashboard() {
    const [apiData, setApiData] = useState(null);
    console.log(apiData)
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("volts");

    const type = searchParams.get('area'); // Get type from query
    const boxId = searchParams.get('U_selections');
    
    const fetchMeterData = async()=>{
      try {
        const response = await fetch(`http://localhost:5000/meter-data`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            area:type,
            U_selections:boxId
          })
        })
        const resResult = await response.json();
        if(response.ok){
          setApiData(resResult.data)
        }
      } catch (error) {
        console.error(error.message)
      }
    }
    useEffect(()=>{
      fetchMeterData();
      const interval = setInterval(() => {
        fetchMeterData();
      }, 5000);
      return ()=>clearInterval(interval)
    },[])
    




 const getVal = (key, unit = "") => {
    const fullKey = `${boxId}_${key}`;
    if (!apiData || apiData[fullKey] === undefined || apiData[fullKey] === null) {
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
          <div className="flex w-[30%] p-1 items-center gap-1 rounded-[5.544px] bg-[#F9FAFB] shadow-[0px_-0.42px_9px_2px_rgba(2,86,151,0.22)]">
            {["volts", "power", "energy"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-[33px] flex-1 flex cursor-pointer items-center justify-center rounded-[5.54px] text-[14px] ${activeTab === tab
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
              onClick={() => router.push(`/datalogs?type=${type}&boxId=${boxId}&tab=${activeTab}`)}
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
              <span className="text-[10px] mt-1 font-semibold transition-opacity duration-200 
                    text-[#1d4ed8] dark:text-white group-hover:opacity-80">
                Logs
              </span>
            </div>


            {/* Light & Dark Images */}
            {["light", "dark"].map((mode) => (
              <img
                key={`${activeTab}-${mode}`}
                src={`/${activeTab}_${mode}.png`}
                alt={`${activeTab} ${mode}`}
                className={`absolute top-0 left-0 w-full ${activeTab === "power" || activeTab === "energy"
                  ? "h-[80%] mt-4"
                  : "h-full"
                  } object-contain ${mode === "light" ? "dark:hidden" : "hidden dark:block"
                  } z-10`}
              />
            ))}

            {/* Overlay Points */}
            {(overlayMaps[activeTab] || []).map(({ key, unit, top, left }, i) => (
              <p
                key={i}
                className="absolute text-[10px] text-black dark:text-blue-400 z-[30]"
                style={{
                  top: `${top}px`,
                  left: `${left}px`,
                  fontFamily: "digital-7, monospace"
                }}
              >
                {getVal(key, unit)}
              </p>


            ))}



          </div>
        </div>
      </div>
    );
  }
