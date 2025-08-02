"use client";

import React, { useState, useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";
import TopHeader from "@/components/layout/TopHeader";
import Header from "@/components/layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "@/redux/slices/authSlice";
import { getActiveTabFromPathname } from "@/utils/navigation-utils";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }) {
  const [activeTab, setActiveTab] = useState("Home");
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    setActiveTab(currentTab);
  }, []);
  useEffect(() => {
    const currentTab = getActiveTabFromPathname(pathname);
    setActiveTab(currentTab);
  }, [pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      await dispatch(initializeAuth());
      setAuthChecked(true);
    };
    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (authChecked && !isAuthenticated) {
      router.replace("/");
    }
  }, [authChecked, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      const expiryTime = exp * 1000;
      const currentTime = Date.now();
      const timeout = setTimeout(() => {
        localStorage.removeItem("token");
        router.push("/");
      }, expiryTime - currentTime);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error("Auto-logout error:", err);
    }
  }, [token, router]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab((prevTab) => {
      if (
        pathname === "/sld" ||
        pathname === "/sld_meters1" ||
        pathname === "/Logs1" ||
        pathname === "/log_detail1"
      )
        return "Diagram";
      else if (
        pathname === "/custom_trend" ||
        pathname === "/comparison_trends"
      )
        return "Trends";
      else if (
        pathname === "/add_roles" ||
        pathname === "/add_user" ||
        pathname === "/view_users"
      )
        return "Setting";
      else if (pathname === "/Recent_Alarms" || pathname === "/All_Alarms")
        return "Alarms";
      else if (pathname === "/energy_cost" || pathname === "/energy_usage")
        return "Reports";
      return prevTab;
    });
  }, [pathname]);

  if (!isAuthenticated) return null;

  return (
    // <div className={` flex flex-col bg-[#f7f7f7] dark:bg-transparent`}>
    //   <TopHeader />
    //   <Header handleTabClick={handleTabClick} />

    //   <div className="flex overflow-x-hidden  xl:p-3 gap-3">
    //     <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />
    //     <main
    //       className="flex-1 w-full overflow-x-auto bg-center bg-contain bg-no-repeat"
    //       style={{ backgroundImage: 'url("./bglogo.png")' }}
    //     >
    //       {children}
    //     </main>
    //   </div>
    // </div>
    <div
      className={` flex flex-col bg-[#f7f7f7] dark:bg-gray-900 overflow-hidden`}
    >
      <TopHeader />
      <Header handleTabClick={handleTabClick} />

      <div className="flex px-4 gap-[0.7vw]">
        <Sidebar activeTab={activeTab} handleTabClick={handleTabClick} />
        <main
          // className="w-full h-full pb-5 md:p-auto md:h-[81vh] overflow-x-hidden overflow-y-auto bg-center bg-contain bg-no-repeat"
          className="w-full h-full pb-5 md:p-auto md:h-[81vh] overflow-hidden bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: 'url("./bglogo.png")' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
