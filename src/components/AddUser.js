"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/config";

export default function AddUser() {
  const [token, setToken] = useState(null);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });

  const baseUrl = `${config.BASE_URL}`;

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);



  // const fetchRoles = async () => {
  //   try {
  //     const res = await axios.get(`${baseUrl}/roles/allrole`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setRoles(res.data.data || []); // ✅ correct key
  //   } catch (err) {
  //     Swal.fire(
  //       "Error",
  //       err.response?.data?.message || "Failed to fetch roles!",
  //       "error"
  //     );
  //   }
  // };
  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/roles/allrole`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(res.data.data || []);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to fetch roles!",
        "error"
      );
    }
  };

  if (token) fetchRoles();
}, [token]);

  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.roleId
    ) {
      Swal.fire("Error", "Please fill in all fields!", "error");
      return;
    }

    try {
      await axios.post(`${config.BASE_URL}/users/addUser`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "User added successfully!", "success");
      setNewUser({ name: "", email: "", password: "", roleId: "" });
    } catch (err) {
      const message = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join("\n")
        : err.response?.data?.message || "Failed to add user!";
      Swal.fire("Error", message, "error");
    }
  };
  //   useEffect(() => {
  //   if (token) fetchRoles();
  // }, [roles,token]);

  return (
    <div>
      <p className="text-black dark:text-white font-[Raleway] text-[18.34px] font-semibold leading-[125%] mt-[40px] mb-5">
        Add New User
      </p>

      <p className="text-[#7F7F7F] dark:text-white font-[Raleway] text-[15.34px] font-normal leading-[125%] mt-5 mb-5">
        Fill in the user details and assign a role to give them access to the
        system
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Role
          </label>
          <select
            value={newUser.roleId}
            onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value })}
            className="border-[rgba(0,0,0,0.33)] w-full px-4 py-2 rounded-md border bg-[rgba(217,217,217,0.17)] border-gray-30 text-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-blue-400 dark:bg-gray-700">
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          onClick={handleAddUser}
          className="flex w-full py-3 justify-center items-center gap-[10px] shrink-0 rounded-[6px] font-[Raleway] bg-[#1A68B2] text-white">
          Add User
        </button>
      </div>
    </div>
  );
}
