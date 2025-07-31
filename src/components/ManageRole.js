"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/config";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [token, setToken] = useState(null);

  const [newRole, setNewRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [editRolePopup, setEditRolePopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editPrivileges, setEditPrivileges] = useState([]);

  const baseUrl = `${config.BASE_URL}`;

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    console.log("[ManageRole] Loaded token:", t);
    console.log("[ManageRole] baseUrl:", baseUrl);
  }, []);

  useEffect(() => {
    if (token) {
      console.log(
        "[ManageRole] token set, calling fetchRoles and fetchPrivileges"
      );
      fetchRoles();
      fetchPrivileges();
    } else {
      console.log("[ManageRole] token not set, skipping API calls");
    }
  }, [token]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [roles]);

  const fetchRoles = async () => {
    console.log("[ManageRole] fetchRoles called", { baseUrl, token });
    try {
      const privRes = await axios.get(`${baseUrl}/privelleges/allprivelleges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allPrivileges = privRes.data || [];
      setPrivileges(allPrivileges);

      const rolesRes = await axios.get(`${baseUrl}/roles/allrole`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawRoles = rolesRes.data.data || [];

      const enrichedRoles = rawRoles.map((role) => ({
        ...role,
        privileges: (role.privelleges || [])
          .map((id) => allPrivileges.find((p) => p._id === id))
          .filter(Boolean),
      }));

      setRoles(enrichedRoles);
      setFilteredRoles(enrichedRoles);
    } catch (err) {
      console.error("[ManageRole] fetchRoles error", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch roles or privileges!",
        "error"
      );
    }
  };

  const fetchPrivileges = async () => {
    console.log("[ManageRole] fetchPrivileges called", { baseUrl, token });
    try {
      const res = await axios.get(`${baseUrl}/privelleges/allprivelleges`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPrivileges(res.data);
    } catch (err) {
      console.error("[ManageRole] fetchPrivileges error", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch privileges!",
        "error"
      );
    }
  };

  const handleAddRole = async () => {
    if (!newRole.trim()) {
      Swal.fire("Error", "Please enter a role name.", "error");
      return;
    }

    try {
      // Step 1: Create Role
      const res = await axios.post(
        `${baseUrl}/roles/addrole`,
        { name: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdRole = res.data?.role || res.data?.data; // adjust based on your API response

      // Step 2: Assign Privileges
      if (createdRole && selectedPrivileges.length > 0) {
        await axios.put(
          `${baseUrl}/roles/${createdRole._id}/privelleges`,
          { privellegeNames: selectedPrivileges },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      Swal.fire("Success", "Role created and privileges assigned!", "success");

      // Reset state
      setNewRole("");
      setSelectedPrivileges([]);
      setShowRolePopup(false);
      fetchRoles();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message ||
          "Failed to add role or assign privileges!",
        "error"
      );
    }
  };

  const handleUpdateRole = async () => {
    if (!editRole || editPrivileges.length === 0) {
      Swal.fire("Error", "Please select at least one privilege.", "error");
      return;
    }
    try {
      await axios.put(
        `${baseUrl}/roles/${editRole._id}/privelleges`,
        { privellegeNames: editPrivileges },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "Privileges updated successfully!", "success");
      setEditRolePopup(false);
      fetchRoles();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to update privileges!",
        "error"
      );
    }
  };

  const handleDeleteRole = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/roles/deleterole/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          fetchRoles();
          Swal.fire("Deleted!", "Role has been removed.", "success");
        } catch (err) {
          Swal.fire(
            "Error",
            err.response?.data?.message || "Failed to delete role!",
            "error"
          );
        }
      }
    });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = roles.filter((role) => {
      const privilegesString = Array.isArray(role.privileges)
        ? role.privileges.map((p) => p.name).join(" ")
        : "";
      return `${role.name} ${privilegesString}`
        .toLowerCase()
        .includes(term.toLowerCase());
    });
    setFilteredRoles(filtered);
  };

  return (
    <div>
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setShowRolePopup(true)}
          className="bg-[#1F5897] text-white px-4 py-2 rounded-md hover:bg-[#17406c]">
          + Add Role
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-end mb-4 gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search roles..."
          className="px-3 py-2 rounded-md border dark:text-white border-gray-300 text-sm text-gray-700 shadow-sm focus:outline-blue-500 w-full sm:w-64"
        />
      </div>

      <div className="w-full overflow-x-auto rounded-md border border-gray-300 bg-white dark:bg-gray-800">
        <table className="min-w-[600px] w-full text-xs md:text-sm text-gray-800 dark:text-white">
          <thead className="bg-[#1A68B252] dark:text-white text-[#1A68B2] font-semibold font-raleway text-[13px] md:text-[15.34px] leading-[125%] h-[40px] md:h-[45px] border-l border-l-[rgba(26,104,178,0.32)] border-r border-r-[rgba(26,104,178,0.32)]">
            <tr>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">#</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">Role</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">Privileges</th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-center whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role, i) => (
              <tr
                key={role._id}
                className="hover:bg-blue-50 dark:hover:bg-gray-900 dark:text-white transition duration-150 ease-in-out h-[40px] md:h-[45px]">
                <td className="px-2 md:px-4 py-2 border border-gray-300">{i + 1}</td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">{role.name}</td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">{(role.privileges || []).map((p) => p.name).join(", ")}</td>
                <td className="px-2 md:px-4 py-2 border border-gray-300 text-center">
                  <div className="flex justify-center gap-2 md:gap-3">
                    <button
                      className="w-6 h-6"
                      onClick={() => {
                        setEditRole(role);
                        setEditPrivileges(role.privileges.map((p) => p._id));
                        setEditRolePopup(true);
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          d="M5 16.0002L4 20.0002L8 19.0002L19.586 7.41419C19.9609 7.03913 20.1716 6.53051 20.1716 6.00019C20.1716 5.46986 19.9609 4.96124 19.586 4.58619L19.414 4.41419C19.0389 4.03924 18.5303 3.82861 18 3.82861C17.4697 3.82861 16.9611 4.03924 16.586 4.41419L5 16.0002Z"
                          stroke="#1A68B2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5 16L4 20L8 19L18 9L15 6L5 16Z"
                          fill="#1A68B2"
                        />
                        <path
                          d="M15 6L18 9M13 20H21"
                          stroke="#1A68B2"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <button
                      className="w-6 h-6"
                      onClick={() => handleDeleteRole(role._id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                          d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19Z"
                          fill="#D90505"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showRolePopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 border-t-4 dark:border-gray-900 dark:border-t-[#1d5998] border-t-[#1d5998] w-[95vw] max-w-[500px] p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <p className="text-black dark:text-white font-raleway text-xl md:text-[27.44px] font-semibold leading-none mb-6">
              Add New Role
            </p>
            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Role Name"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-blue-400"
              />
              <div className="text-gray-700 dark:text-white font-semibold mt-4">
                Select Privileges:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {privileges.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 text-gray-700 dark:text-white">
                    <input
                      type="checkbox"
                      checked={selectedPrivileges.includes(p._id)}
                      onChange={() =>
                        setSelectedPrivileges((prev) =>
                          prev.includes(p._id)
                            ? prev.filter((id) => id !== p._id)
                            : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={handleAddRole}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md">
                Save
              </button>
              <button
                onClick={() => setShowRolePopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {editRolePopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 border-t-4 dark:border-gray-900 dark:border-t-[#1d5998] border-t-[#1d5998] w-[95vw] max-w-[500px] p-4 sm:p-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <p className="text-black dark:text-white font-raleway text-xl md:text-[27.44px] font-semibold leading-none mb-6">
              Edit Role: {editRole?.name}
            </p>

            <div className="space-y-3 mb-6">
              <div className="text-gray-700 dark:text-white font-semibold">
                Update Privileges:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {privileges.map((p) => (
                  <label
                    key={p._id}
                    className="flex items-center gap-2 text-gray-700 dark:text-white">
                    <input
                      type="checkbox"
                      checked={editPrivileges.includes(p._id)}
                      onChange={() =>
                        setEditPrivileges((prev) =>
                          prev.includes(p._id)
                            ? prev.filter((id) => id !== p._id)
                            : [...prev, p._id]
                        )
                      }
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={handleUpdateRole}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
                Save
              </button>
              <button
                onClick={() => setEditRolePopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
