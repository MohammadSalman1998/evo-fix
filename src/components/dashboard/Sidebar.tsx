// src\components\dashboard\Sidebar.tsx
"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ThemeContext } from "@/app/context/ThemeContext";
import { AuthContext } from "@/app/context/AuthContext";
import technicalImage from "@/components/assets/images/technicalImage.png";
import userImage from "@/components/assets/images/userImage.png";

import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaTools,
  FaFileInvoice,

} from "react-icons/fa";
import { API_BASE_URL } from "../../utils/api";
import Cookies from "js-cookie";
import axios from "axios";
import {
  fetchNotificationsCount,
  startNotificationsCount,
} from "@/utils/notification-count";

interface SidebarProps {
  onSelectOption: (option: string) => void;
}

interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeOption, setActiveOption] = useState<string>(() => {
    return localStorage.getItem("activeOption") || "viewHome";
  });

  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("email");
    setIsLoggedIn(!!token);
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await fetchNotificationsCount();
        setNotificationsCount(count);
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };
    fetchCount();
  }, []);

  useEffect(() => {
    const stopPolling = startNotificationsCount(setNotificationsCount);
    return () => stopPolling();
  }, []);

  const handleOptionSelect = (option: string) => {
    setActiveOption(option);
    if (option !== "profile") {
      localStorage.setItem("activeOption", option);
    }
    onSelectOption(option);
    setIsMobileSidebarOpen(false);
  };

  const handleProfile = () => {
    setActiveOption("profile");
    onSelectOption("profile");
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("activeOption");
    setIsMobileSidebarOpen(false);
  };

  const fetchUserData = async () => {
    const userId = localStorage.getItem("userId");
    const token = Cookies.get("token");
    if (userId && token) {
      try {
        const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error: unknown) {
        console.error("خطأ في تحميل بيانات المستخدم", error);
      }
    } else {
      console.error("User ID أو token مفقود.");
    }
  };

  const mainRow = [
    {
      key: "viewHome",
      name: "الرئيسية",
      icon: <FaHome className="text-2xl" />,
    },
    {
      key: "viewRequests",
      name: "طلبات الإصلاح",
      icon: <FaTools className="text-2xl" />,
    },
    {
      key: "Invoices",
      name: "الفواتير",
      icon: <FaFileInvoice className="text-2xl" />,
    },
    {
      key: "notifications",
      name: "الإشعارات",
      icon: (
        <div className="relative">
          <FaBell className="text-2xl" />
          {notificationsCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5"
            >
              {notificationsCount}
            </motion.span>
          )}
        </div>
      ),
    },
    {
      key: "profile",
      name: "الملف الشخصي",
      icon: <FaUser className="text-2xl" />,
      onClick: handleProfile,
    },
  ];
  const sidebarRow = mainRow.filter((option) => option.key !== "viewHome");

  return (
    <>
      {/* Sidebar for Desktop */}
      <div 
        className={`
          hidden md:block fixed right-0 top-16 h-screen w-64 
          ${isDarkMode ? 'bg-gray-800' : 'bg-gray-700'} 
          shadow-lg z-40 overflow-y-auto
        `}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center mb-8">
            <Image
              src={
                userData && userData.role === "TECHNICAL"
                  ? technicalImage
                  : userImage
              }
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full object-cover shadow-lg"
            />
            <span className="ml-4 font-bold text-white">
              {userData ? userData.fullName : "Loading..."}
            </span>
          </div>

          {sidebarRow.map((option) => (
            <button
              key={option.key}
              onClick={() => handleOptionSelect(option.key)}
              className={`
                flex items-center w-full p-3 rounded-lg transition-colors 
                ${activeOption === option.key 
                  ? 'bg-blue-600 text-white' 
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-blue-500/30' 
                    : 'text-white hover:bg-blue-500/30'
                }
              `}
            >
              {option.icon}
              <span className="mr-4">{option.name}</span>
            </button>
          ))}

          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="
                flex items-center w-full p-3 rounded-lg 
                text-red-400 hover:text-red-600 transition-colors
              "
            >
              <FaSignOutAlt className="text-2xl ml-2" />
              <span className="mr-4">تسجيل الخروج</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div 
        className="
          fixed bottom-0 left-0 right-0 md:hidden 
          bg-gray-800 shadow-2xl z-50
        "
      >
        <div className="flex justify-between p-3">
          {mainRow.map((option) => (
            <button
              key={option.key}
              onClick={() => 
                option.key === "profile" 
                  ? handleProfile() 
                  : handleOptionSelect(option.key)
              }
              className={`
                flex flex-col items-center p-2 rounded-lg
                ${activeOption === option.key 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700'
                }
              `}
            >
              {option.icon}
              <span className="text-xs mt-1">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;