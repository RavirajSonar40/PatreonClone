"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    profilePic: "",
    coverPic: "",
    razorpayId: "",
    razorpaySecret: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user/route.js"); // Update this to the correct endpoint
      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
          profilePic: data.profilepic || "",
          coverPic: data.coverpic || "",
          razorpayId: data.razorpayId || "",
          razorpaySecret: data.razorpaySecret || "",
        });
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      name: userData.name,
      razorpayId: userData.razorpayId,
      razorpaySecret: userData.razorpaySecret,
      profilePic: userData.profilePic,
      coverPic: userData.coverPic,
    };

    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        // Refetch user data after a successful update
        fetchUserData();

        // Redirect to another page after the update
        router.push("/your-page"); // Replace '/your-page' with the desired page route
      } else {
        console.error("Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center text-white">User Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your name"
              value={userData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={userData.email}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={userData.username}
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="profilePic">Profile Picture URL</label>
            <input
              type="text"
              id="profilePic"
              name="profilePic"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter profile picture URL"
              value={userData.profilePic}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="coverPic">Cover Picture URL</label>
            <input
              type="text"
              id="coverPic"
              name="coverPic"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter cover picture URL"
              value={userData.coverPic}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="razorpayId">Razorpay ID</label>
            <input
              type="text"
              id="razorpayId"
              name="razorpayId"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your Razorpay ID"
              value={userData.razorpayId}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-white" htmlFor="razorpaySecret">Razorpay Secret</label>
            <input
              type="password"
              id="razorpaySecret"
              name="razorpaySecret"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your Razorpay Secret"
              value={userData.razorpaySecret}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-semibold transition-colors duration-300">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
