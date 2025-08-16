"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import config from "@/constant/apiRouteList";
import { privilegeConfig } from "@/constant/navigation";
import { privilegeOrder } from "@/constant/navigation";
import MobileSidebar from "./MobileSidebar";
import ThemeSwitcher from "@/themeSwitcher/ThemeSwitcher";
import { getActiveTabFromPathname } from "@/utils/navigation-utils";

const Header = ({ handleTabClick, activeTab }) => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const [bellIcon, setBellIcon] = useState("basil_notification-solid.png");
  const [newAlarmCount, setNewAlarmCount] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const acknowledgedAlarms = useRef([]);

  // fetch user details
  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    if (currentTab !== activeTab) {
      handleTabClick(currentTab);
    }
  }, [pathname, activeTab, handleTabClick]);

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${config.BASE_URL}${config.USER.PROFILE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const privileges = data?.role?.privelleges?.map((p) => p.name) || [];

        setUserPrivileges(privileges);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // fetch alarms
  const fetchAlarms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${config.BASE_URL}${config.ALARMS.BELL}`);
      let newAlarms = res.data.bells || [];
      newAlarms = newAlarms.filter(
        (alarm) => !acknowledgedAlarms.current.includes(alarm._id)
      );

      setBellIcon(
        newAlarms.length > 0 ? "alert.gif" : "basil_notification-solid.png"
      );
      setNewAlarmCount(newAlarms.length);
      setAlarms(newAlarms.slice(0, 5));
      setError(null);
    } catch (err) {
      console.error("Alarm error:", err);
      // Handle different types of errors gracefully
      if (
        err.code === "ECONNREFUSED" ||
        err.code === "ERR_NETWORK" ||
        err.message.includes("Network Error")
      ) {
        setError(null); // Don't show error for network issues, just show no alarms
      } else {
        setError("Failed to fetch alarms.");
      }

      setBellIcon("basil_notification-solid.png");
      setNewAlarmCount(0);
      setAlarms([]);
    } finally {
      setIsLoading(false);
    }
  };

  // fetch acknowledge
  const acknowledgeAlarms = async () => {
    if (alarms.length === 0) return;

    try {
      const res = await axios.post(
        `${config.BASE_URL}${config.ALARMS.ACKNOWLEDGE}`
      );
      if (res.data.success) {
        setBellIcon("basil_notification-solid.png");
        setNewAlarmCount(0);
        acknowledgedAlarms.current = [
          ...acknowledgedAlarms.current,
          ...alarms.map((a) => a._id),
        ];
        setAlarms([]);
        setNotificationVisible(false);
      }
    } catch (err) {
      console.error("Acknowledge error:", err);
      // Even if acknowledge fails, clear the alarms locally
      setBellIcon("basil_notification-solid.png");
      setNewAlarmCount(0);
      setAlarms([]);
      setNotificationVisible(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotificationVisibility = () =>
    setNotificationVisible(!isNotificationVisible);

  useEffect(() => {
    fetchUserDetails();
    // fetchAlarms();
    // const interval = setInterval(fetchAlarms, 5000);
    // return () => clearInterval(interval);
  }, []);

  const renderLink = (key) => {
    const config = privilegeConfig[key];
    if (!config) return null;

    const isActive = config.matchPaths.includes(pathname);

    return (
      <Link
        key={key}
        href={config.href}
        className="py-[8px]  px-4"
        onClick={() => handleTabClick(config.tab)}
      >
        <p
          className={`px-3 py-1 cursor-pointer rounded-sm flex gap-1 ${
            isActive
              ? "bg-white text-black dark:bg-gray-700 dark:text-white"
              : ""
          }`}
        >
          <FontAwesomeIcon icon={config.icon} style={{ fontSize: "1.1em" }} />
          {config.label}
        </p>
      </Link>
    );
  };

  return (
    <header className="bg-[#1F5897] text-white mx-0 my-2 mt-0 h-[44px] flex text-sm items-center justify-between w-full">
      <div className="xl:hidden flex justify-between items-center px-4 py-2">
        <button onClick={toggleDropdown}>
          <FontAwesomeIcon
            icon={isDropdownOpen ? faXmark : faBars}
            style={{ fontSize: "1.5em" }}
          />
        </button>
      </div>
      <nav className={`bg-[#1F5897] hidden  xl:flex w-full`}>
        {privilegeOrder
          .filter((key) => userPrivileges.includes(key))
          .map((key) => renderLink(key))}
      </nav>
      <div className="flex xl:hidden">
        <div
          className={`fixed top-[44px] left-0 w-full z-[999] transition-all duration-500 ${
            isDropdownOpen
              ? "opacity-100 max-h-[1000px]"
              : "opacity-0 max-h-0 overflow-hidden pointer-events-none"
          }`}
        >
          <MobileSidebar
            userPrivileges={userPrivileges}
            closeSidebar={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className=" flex items-center">
          <ThemeSwitcher />
        </div>
        <div className="relative mr-4 mt-1">
          <div className="relative inline-block">
            <img
              src={`./${bellIcon}`}
              alt="Bell Icon"
              className="ml-2 cursor-pointer w-8 h-8"
              onClick={toggleNotificationVisibility}
            />
            {bellIcon === "alert.gif" && newAlarmCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1 transform translate-x-1/2 -translate-y-1/2">
                {/* {newAlarmCount} */}
              </span>
            )}
          </div>

          {isNotificationVisible && (
            <div className="absolute top-full right-0 w-80 bg-white dark:bg-gray-800 shadow-lg border rounded-lg z-[9999] p-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-black dark:text-white text-center w-full">
                  Alarms
                </p>
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => setNotificationVisible(false)}
                >
                  <svg
                    className="w-6 h-6"
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
              {/* Content */}
              <div className="p-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      Loading alarms...
                    </div>
                  </div>
                ) : alarms.length > 0 ? (
                  <>
                    {/* Alarms List */}
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {alarms.map((alarm, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 p-2 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        >
                          <div className="flex-shrink-0 mt-1">
                            <svg
                              className="w-5 h-5 text-blue-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 2C6.477 2 3.5 4.977 3.5 8.5c0 4.5 6.5 11.5 6.5 11.5s6.5-7 6.5-11.5C16.5 4.977 13.523 2 10 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-black dark:text-white">
                              {alarm.Source}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {alarm.Status}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {alarm.current_time}
                            </div>
                            <button className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-1">
                              Detail
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Acknowledge Button */}
                    <div className="text-center">
                      <button
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors duration-200"
                        onClick={acknowledgeAlarms}
                      >
                        Acknowledge
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* No Alarms State */}
                    <div className="text-center py-8 ">
                      <div className="relative mx-auto  ">
                        {/* Center bell */}
                        <div className=" flex items-center flex-col gap-7  justify-center ">
                          <img
                            src="./bell123.png"
                            alt="bell"
                            class="w-[1200px]"
                          />
                        </div>
                      </div>

                      <div className="text-gray-600 dark:text-gray-400 text-base mt-8  ">
                        No Alarms available yet!
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
