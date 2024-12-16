// src\app\services\page.tsx
"use client";
import React, { useContext } from "react";
import Navbar from "@/components/navBar";
import { ThemeContext } from "../context/ThemeContext";
import { Toaster } from "react-hot-toast";

const LoginForm = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <>
      <Navbar />
      <Toaster />
      <div
        className={`flex justify-center opacity-90 login items-center h-screen ${
          isDarkMode ? "dark-bg-2" : "light-bg-2"
        }`}
      >
        services
      </div>
    </>
  );
};

export default LoginForm;
