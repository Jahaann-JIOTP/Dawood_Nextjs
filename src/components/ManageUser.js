"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import config from "@/config";

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(null);
  const [editUserPopup, setEditUserPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  const [editUserData, setEditUserData] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
  });

  const baseUrl = `${config.BASE_URL}`;
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRoles();
    }
  }, [token]);

  useEffect(() => {
    handleSearch(searchTerm);
  }, [users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/users/allUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("[ManageUser] fetchUsers error", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch users!",
        "error"
      );
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/roles/allrole`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data.data || []); // ✅ correct key
    } catch (err) {
      console.error("[ManageUser] fetchRoles error", err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch roles!",
        "error"
      );
    }
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/users/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}`},
          });
          Swal.fire(
            "Deleted!",
            "User has been removed successfully.",
            "success"
          );
          fetchUsers();
        } catch (error) {
          Swal.fire(
            "Error",
            error.response?.data?.message || "Failed to delete user!",
            "error"
          );
        }
      }
    });
  };

  const handleUpdateUser = async () => {
    try {
      await axios.patch(
        `${baseUrl}/users/update/${editUserData._id}`,
        {
          name: editUserData.name,
          email: editUserData.email,
          role: editUserData.role,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Success", "User updated successfully!", "success");
      setEditUserPopup(false);
      fetchUsers();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update user!",
        "error"
      );
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      `${user.name} ${user.email} ${user.role?.name || ""}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
    handleSort(sortConfig.key, sortConfig.direction, filtered);
  };

  const handleSort = (
    key,
    directionOverride = null,
    userList = filteredUsers
  ) => {
    let direction = directionOverride || "asc";
    if (
      !directionOverride &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sorted = [...userList].sort((a, b) => {
      let valA = a[key] || "";
      let valB = b[key] || "";

      if (typeof valA === "object") valA = valA.name;
      if (typeof valB === "object") valB = valB.name;

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredUsers(sorted);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSortUp className="inline-block ml-1 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline-block ml-1 text-blue-500" />
    ) : (
      <FaSortDown className="inline-block ml-1 text-blue-500" />
    );
  };

  return (
    <div>
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center mb-4 gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search users..."
          className="px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-700 dark:text-white shadow-sm focus:outline-blue-500 w-full sm:w-64"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-gray-300 bg-white dark:bg-gray-800">
        <table className="  min-w-[600px] w-full text-xs md:text-sm text-gray-800 dark:text-white">
          <thead className="bg-[#1A68B252] text-[#1A68B2] font-semibold font-raleway text-[13px] md:text-[15.34px] leading-[125%] h-[40px] md:h-[45px] border-l border-l-[rgba(26,104,178,0.32)] border-r border-r-[rgba(26,104,178,0.32)]">
            <tr>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">
                Sr No
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">
                User Name
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">
                User Email
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-left whitespace-nowrap">
                User Role
              </th>
              <th className="px-2 md:px-4 py-2 md:py-3 text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, i) => (
              <tr
                key={user._id}
                className="hover:bg-blue-50 dark:text-white dark:hover:bg-gray-900 transition duration-150 ease-in-out h-[40px] md:h-[45px]">
                <td className="px-2 md:px-4 py-2 border border-gray-300 font-bold">
                  {i + 1}
                </td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">
                  {user.name}
                </td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">
                  {user.email}
                </td>
                <td className="px-2 md:px-4 py-2 border border-gray-300">
                  {user.role?.name || "N/A"}
                </td>
                <td className="px-2 md:px-4 py-2 border border-gray-300 text-center">
                  <div className="flex justify-center gap-2 md:gap-3">
                    {/* Edit */}
                    <button
                      className="w-6 h-6"
                      onClick={() => {
                        setEditUserData({
                          _id: user._id,
                          name: user.name,
                          email: user.email,
                          role: user.role?._id || "",
                        });
                        setEditUserPopup(true);
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
                    {/* Delete */}
                    <button
                      className="w-6 h-6"
                      onClick={() => handleDeleteUser(user._id)}>
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
      {/* Edit Modal */}
      {editUserPopup && (
        <div className="fixed inset-0 bg-[rgba(87,87,87,0.78)] bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 border-t-4 dark:border-gray-900 dark:border-t-[#1d5998] border-t-[#1d5998] w-[95vw] max-w-[400px] p-4 sm:p-6 animate-fadeIn">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-4">
              Edit User
            </h2>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editUserData.name}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUserData.email}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                  Role
                </label>
                <select
                  value={editUserData.role}
                  onChange={(e) =>
                    setEditUserData({ ...editUserData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-md border border-gray-300 bg-[rgba(217,217,217,0.17)] text-gray-700 focus:outline-none focus:ring-2 dark:bg-gray-700 focus:ring-blue-400 dark:text-white">
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={handleUpdateUser}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md transition-all">
                Save
              </button>
              <button
                onClick={() => setEditUserPopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded-md transition-all">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
