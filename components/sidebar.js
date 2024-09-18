// components/Sidebar.jsx
"use client";
import React from "react";
import Link from "next/link";

const Sidebar = ({ onClose }) => {
  return (
    <div className="fixed z-50 top-[250px] left-0 w-1/5 h-[calc(100vh-250px)] bg-gray-800 text-white p-4">
      <button className="absolute top-4 right-4 text-xl" onClick={onClose}>
        &times;
      </button>
      <h2 className="text-lg font-bold mb-4">Menu</h2>
      <ul>
        <li className="py-2">
            <Link href={"/editprofilepage"}>
          <button href="#edit" className="hover:underline">Edit Profile</button>
            </Link>
        </li>
        <li className="py-2">
          <a href="#settings" className="hover:underline">Settings</a>
        </li>
        <li className="py-2">
          <a href="#secrets" className="hover:underline">Secrets </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
