"use client";

import { useState } from "react";
import ViewUsersTab from "../../../components/ManageUser";
import AddUserTab from "../../../components/AddUser";
import RolesTab from "../../../components/ManageRole";

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("view");

  return (
    <div className="bg-white dark:bg-gray-800 p-3 md:p-6 rounded-lg shadow-lg border-2    max-w-screen h-[81vh] overflow-y-auto ">
      <div className="text-[#1d5998] font-raleway dark:text-white text-lg md:text-[22.34px] font-semibold leading-[125%] mb-4 md:mb-5">
        User Management
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-6 md:gap-16 border-b-2 border-[rgba(0,0,0,0.14)] mt-6 md:mt-10 pb-2">
        <button
          onClick={() => setActiveTab("view")}
          className={`font-raleway text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
            activeTab === "view"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}>
          View Users
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`font-raleway text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
            activeTab === "add"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}>
          Add Users
        </button>
        <button
          onClick={() => setActiveTab("roles")}
          className={`font-raleway text-base md:text-[16.439px] font-semibold leading-normal transition-colors ${
            activeTab === "roles"
              ? "text-[#1A68B2]"
              : "text-black dark:text-white"
          }`}>
          Roles
        </button>
      </div>

      {/* Render Active Tab */}
      <div className="mt-4">
        {activeTab === "view" && <ViewUsersTab />}
        {activeTab === "add" && <AddUserTab />}
        {activeTab === "roles" && <RolesTab />}
      </div>
    </div>
  );
}
