"use client";

import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setIsSidebarOpen : Dispatch<SetStateAction<boolean>>
  isSidebarOpen : boolean;
};

const Sidebar = ({setIsSidebarOpen,isSidebarOpen}: Props) => {

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  return (
    <aside
      className={`bg-blue-600 text-white transition-all duration-300 fixed left-0 top-0 bottom-0 h-screen overflow-hidden ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div
        className={`p-4 flex items-center  ${
          !isSidebarOpen ? "justify-center" : "justify-start"
        }`}
      >
        <button
          className="text-white"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
      <nav
        className={`flex flex-col mt-4  ${
          !isSidebarOpen ? "items-center" : ""
        } `}
      >
       

        <Link
          href="/dashboard"
          className="py-2 px-3 rounded hover:bg-blue-500 flex items-center justify-between"
        >
          <span className={`${isSidebarOpen ? "inline" : "hidden"} ml-2`}>
          Dashboard
          </span>
          📝
        </Link>
        <Link
          href="/projects"
          className="py-2 px-3 rounded hover:bg-blue-500 flex items-center justify-between"
        >
          <span className={`${isSidebarOpen ? "inline" : "hidden"} ml-2`}>
            Projects
          </span>
          📝
        </Link>

       
      </nav>
    </aside>
  );
};

export default Sidebar;
