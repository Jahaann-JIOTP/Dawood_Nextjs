"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { ImArrowLeft2 } from "react-icons/im";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);
  const meterId = searchParams.get("boxId");
  const tab = searchParams.get("tab");
  const meterName = searchParams.get("type");

  return (
    <div className="w-full bg-white p-5 h-[81vh] rounded-md border-t-3 border-[#1F5897] overflow-auto">
      <div className="w-full flex items-center justify-between">
        <h1 className="font-semibold text-2xl font-inter pb-4">Logs</h1>
        <button
          onClick={() => router.back()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={` flex items-center ${
            isHovered ? "justify-center" : "justify-start"
          } gap-2 h-[40px] cursor-pointer bg-[#1F5897] transition-all duration-300 ease-in-out overflow-hidden border-[3px] border-[#d8dfe7] dark:border-[#d8dfe738] text-white px-2 ${
            isHovered ? "w-[90px]" : "w-[40px]"
          }`}
          style={{
            borderRadius: isHovered ? "8px" : "50%",
          }}
        >
          <ImArrowLeft2 className="text-white shrink-0" />
          <span
            className={`whitespace-nowrap transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            Back
          </span>
        </button>
      </div>
      <div className="relative w-[1200px] flex items-start justify-center flex-col mx-auto">
        <div className="w-full flex items-center justify-center">
          {tab === "volts" ? (
            <img src="./voltage-logs.png" alt="Voltage logs" />
          ) : tab === "energy" ? (
            <img src="/energy-logs.png" alt="energy logs" />
          ) : tab === "power" ? (
            <img src="power-logs.png" alt="energy logs" />
          ) : (
            ""
          )}
        </div>
        {/* voltage logs buttons */}

        {tab === "volts" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px]  top-[105px] cursor-pointer   left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=voltage&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px] top-[197px]   cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=current&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px] top-[290px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=power_factor&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
          </>
        ) : tab === "power" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px]  top-[104px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=active_power&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[197px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=reactive_power&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[290px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=apparent_power&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
            <button
              className="absolute w-[57px] h-[59px]  top-[382px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=harmonics&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
          </>
        ) : tab === "energy" ? (
          <>
            <button
              className="absolute w-[57px] h-[59px] top-[122px] cursor-pointer left-[754px]"
              onClick={() =>
                router.push(
                  `/log-detail?val=active_energy&meter_id=${meterId}&meter-name=${meterName}`
                )
              }
            ></button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default page;
