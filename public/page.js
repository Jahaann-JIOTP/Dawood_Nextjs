"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const [motorOn, setMotorOn] = useState(true);
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://13.234.241.103:1880/ifl_realtime");
        setApiData(res.data);
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
    <div className="">
   <div className="relative w-full p-4 h-[84vh] rounded-[8px] bg-white border-2 border-gray-400 border-t-4 border-t-[#1d5999] overflow-auto">
      {/* Heading */}
      <h3 className="ml-5 text-2xl font-bold mb-4 text-[#626469]">
        Chillers Cooling Tower
      </h3>
      {/* <button className="border border-gray-300 p-1 rounded" onClick={()=>setMotorOn(!motorOn)}>Switch</button> */}
      {/* Container with fixed dimensions */}
      <div className="flex justify-center w-full">
      <div
        className="relative w-[1000px] h-[580px]"
        // style={{ width: "1300px", height: "580px" }}
      >
        {/* main image */}
        <img
          src="/new-main-sld.png"
          alt="IFL Mimic"
          style={{ width: "auto", height: "530px" }}
          className="absolute top-0 left-0"
          />

          {motorOn && (<img
          src="/NJH.png"
          alt=""
          className="absolute top-[327px] left-[89px] w-[23px] h-[18px]"
          />)}
          {motorOn && (<img
          src="/group.png"
          alt=""
          className="absolute top-[324px] left-[765px] w-[23px] h-[18px]"
          />)}
          {motorOn && (<img
          src="/level.png"
          alt=""
          className="absolute top-[395.4px] left-[667px] w-[14px] h-[14px]"
          />)}
          {motorOn && (<img
          src="/level2.png"
          alt=""
          className="absolute top-[395.4px] left-[193px] w-[14px] h-[14px]"
          />)}
          {motorOn && (<img
          src="/group1.png"
          alt=""
          className="absolute top-[180px] left-[294px] w-[8px] h-[10px] z-10"
          />)}
          {motorOn && (<img
          src="/group2.png"
          alt=""
          className="absolute top-[180px] left-[575px] w-[8px] h-[10px] z-10"
          />)}
          {motorOn && (<img
          src="/rectangle1.png"
          alt=""
          className="absolute top-[166px] left-[291px] w-[5px] h-[9px]"
          />)}
          {motorOn && (<img
          src="/rectangle2.png"
          alt=""
          className="absolute top-[167px] left-[579px] w-[7px] h-[8px]"
          />)}
          


          {/* fan 1 */}
        <img
          src="/fan.gif"
          alt="IFL Mimic"
          style={{ width: "85px", height: "30px" }}
          className="absolute top-45 left-[265px]"
          />
          {/* fan 2 */}
        <img
          src="/fan.gif"
          alt="IFL Mimic"
          style={{ width: "85px", height: "30px" }}
          className="absolute top-45 left-[526px]"
          />
            {/* gear_oil 1 */}
        <img
          src="/Group 1000005857.png"
          alt="IFL Mimic"
          style={{ width: "25px", height: "17px" }}
          className="absolute top-44 left-[294px]"
          />
          {/* gear_oil 2 */}
        <img
          src="/Group 1000005856.png"
          alt="IFL Mimic"
          style={{ width: "25px", height: "17px" }}
          className="absolute top-44 left-[557px]"
          />
          {/* water drop 1 */}
          
          <img
            src="/water-drop.gif"
            alt="IFL Mimic"
            className="absolute top-55 left-[239px] h-[30px] "
            />
          <img
            src="/water-drop.gif"
            alt="IFL Mimic"
            className="absolute top-55 left-[324px] h-[30px] "
            />
          {/* water drop 2 */}
        <img
          src="/water-drop.gif"
          alt="IFL Mimic"
          className="absolute top-55 left-[493px] h-[30px]"
          />
        <img
          src="/water-drop.gif"
          alt="IFL Mimic"
          className="absolute top-55 left-[580px] h-[30px]"
          />
          {/* water wave 1 */}
          <img
            src="/water-wave.gif"
            alt="IFL Mimic"
            style={{ width: "238px", height: "59px" }}
            className="absolute top-93 left-[174px]"
            />
          {/* water wave 2 */}
        <img
          src="/water-wave.gif"
          alt="IFL Mimic"
          style={{ width: "238px", height: "59px" }}
          className="absolute top-93 left-[433px]"
          />
  

          {/* Overlayed Data */}
            <div className="data-container">
              <p className="e07-1m1">{getVal("r_Inverter3_Speed_3851_E07_Q01_Scaled", "RPM")}</p>
              <p className="e07-1m1-1">{getVal("U_5_ActivePower_A_kW", "kW")}</p>
              <p className="e07-1m1-2">{getVal("U_5_Current_AN_Amp", "A")}</p>
              <p className="e07-1m1-3">{getVal("U_5_Voltage_AN_V", "V")}</p>
              <p className="f1-51-78">{getVal("r_Cooling_Tower_Makeup_3851_FQI_71_Scaled")}</p>
              <p className="p1-51-71">{getVal("r_Pressure_3851_PI_78_Scaled")}</p>
              <p className="t1-51-71">{getVal("r_Cooling_Water_Supply_Header_3851_TI_44_Scaled")}</p>
              <p className="f1-58-88">{getVal("r_Cooling_Tower_Makeup_4101_FQI_06_Scaled")}</p>
              <p className="p1-51-81">{getVal("r_Pressure_4101_PI_56_Scaled")}</p>
              <p className="t1-51-81">{getVal("r_Cooling_Water_Supply_Header_4101_TI_44_Scaled")}</p>
              <p className="e08-1m1-1">{getVal("U_6_ActivePower_A_kW", "kW")}</p>
              <p className="e08-1m1-2">{getVal("U_6_Current_AN_Amp", "A")}</p>
              <p className="e08-1m1-3">{getVal("U_6_Voltage_AN_V", "V")}</p>
              <p className="e08-1m1-4">{getVal("r_Inverter4_Speed_3851_E08_Q01_Scaled", "RPM")}</p>
              <p className="p1-51-78">{getVal("r_Pressure_4101_PI_56_Scaled")}</p>
              <p className="u1-51-51-1">{getVal("U_5_ActiveEnergy_A_kWh")}</p>
              <p className="u1-51-51-2">{getVal("U_5_ActiveEnergy_B_kWh")}</p>
              <p className="fqi-51-81-1">{getVal("r_Cooling_Tower_Makeup_4101_FQI_06_Scaled", "m3/h")}</p>
              <p className="fqi-51-81-2">{getVal("U2_FM2_Totalizer", "m3")}</p>
              <p className="tic-51-81-1">{getVal("TIC_51_81", "%")}</p>
              <p className="tic-51-81-2">{getVal("TIC_51_81_SP", "SP")}</p>
              <p className="tic-51-82">{getVal("r_Cooling_Water_Supply_Header_4101_TI_44_Scaled", "\u00b0C")}</p>
              <p className="t1-51-72">{getVal("r_Cooling_Water_Supply_Header_4101_TI_71_Scaled", "\u00b0C")}</p>
              <p className="tic-51-71-1">{getVal("TIC_51_71", "%")}</p>
              <p className="tic-51-71-2">{getVal("TIC_51_71_SP", "SP")}</p>
              <p className="fqi-51-71-1">{getVal("r_Cooling_Tower_Makeup_3851_FQI_71_Scaled", "m3/h")}</p>
              <p className="fqi-51-71-2">{getVal("U1_FM1_Totalizer", "m3")}</p>
              <p className="container-1">{getVal("r_Cooling_Water_Supply_Header_3851_TI_72_Scaled", "\u2206t")}</p>
              <p className="container-2">{getVal("r_Cooling_Water_Supply_Header_4101_TI_54_Scaled", "\u2206t")}</p>
            </div>
        </div>
        </div>
      </div>

      {/* Styled JSX for absolute positioning & custom font */}
      <style jsx>{`
        .data-container p {
          position: absolute;
          font-size: 0.8rem;
          color: #4fff00; /* Bright green color */
          font-family: 'digital-7', sans-serif;
        }

        /* Load custom digital font (ensure the path is correct) */
        @font-face {
          font-family: 'digital-7';
          src: url('/includes/Digital Numbers 400.ttf');
        }

        /* Positioning classes (adjust as needed to match your diagram) */
        
        .e07-1m1 {
          top: 140px;
          left: 222px;
        }
        .e07-1m1-1 {
          top: 74px;
          left: 287px;
        }
        .e07-1m1-2 {
          top: 91px;
          left: 287px;
        }
        .e07-1m1-3 {
          top: 109px;
          left: 287px;
        }
        .f1-51-78 {
          top: 72px;
          left: 377px;
        }
        .p1-51-71 {
          top: 110px;
          left: 375px;
        }
        .t1-51-71 {
          top: 147px;
          left: 375px;
        }
        .f1-58-88 {
          top: 74px;
          left: 458px;
        }
        .p1-51-81 {
          top: 111px;
          left: 458px;
        }
        .t1-51-81 {
          top: 149px;
          left: 458px;
        }
        .e08-1m1-1 {
          top: 74px;
          left: 549px;
        }
        .e08-1m1-2 {
          top: 92px;
          left: 549px;
        }
        .e08-1m1-3 {
          top: 110px;
          left: 545px;
        }
        .e08-1m1-4 {
          top: 142px;
          left: 614px;
          font-size: 0.7rem;
        }
        .p1-51-78 {
          top: 24px;
          left: 612px;
        }
        .fqi-51-81-1 {
          top: 273px;
          left: 755px;
        }
        .fqi-51-81-2 {
          top: 290px;
          left: 755px;
        }
        .tic-51-81-1 {
          top: 397px;
          left: 823px;
        }
        .tic-51-81-2 {
          top: 415px;
          left: 823px;
        }
        .u1-51-51-1 {
          top: 24px;
          left: 688px;
        }
        .u1-51-51-2 {
          top: 41px;
          left: 688px;
        }
        .tic-51-82 {
          top: 475px;
          left: 747px;
          font-size: 0.6rem;
        }
        .t1-51-72 {
          top: 471px;
          left: 74px;
        }
        .tic-51-71-1 {
          top: 391px;
          left: 10px;
          }
        .tic-51-71-2 {
            top: 409px;
            left: 10px;
            }
        .fqi-51-71-1 {
              top: 275px;
              left: 74px;
            }
        .fqi-51-71-2 {
          top:291px;
          left: 76px;
        }
        .container-1{
        top:274px;
        left:284px;
        }
        .container-2{
        top: 274px;
        left: 546px;
        }
      `}</style>
    </div>
  );
}
