// src\app\technicaldashboard\RepairRequests\RepairRequests.tsx
"use client";

import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
import RepairRequestCard from "@/components/RepairRequestCard";
import { RepairRequest } from "@/utils/types";
import { 
  FaSync, 
  FaListAlt, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaArchive, 
  FaBars
} from "react-icons/fa";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<string>("available");
  const [isTabMenuOpen, setIsTabMenuOpen] = useState<boolean>(false);

  const statusMap: { [key: string]: string } = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جارٍ التنفيذ",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
    ASSIGNED: "قيد التسعير",
    QUOTED: "انتظار القبول",
  };

  const fetchRepairRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      const token = Cookies.get("token");

      const [technicianRequests, pendingRequests] = await axios.all([
        axios.get(`${API_BASE_URL}/maintenance-requests/all/technician`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE_URL}/maintenance-requests/all/Pending`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const technicianData = Array.isArray(technicianRequests.data)
        ? technicianRequests.data
        : [];
      const pendingData = Array.isArray(pendingRequests.data)
        ? pendingRequests.data
        : [];

      const mergedData = [...technicianData, ...pendingData];
      setRepairRequests(mergedData);

      if (typeof window !== "undefined") {
        localStorage.setItem("repairRequests", JSON.stringify(mergedData));
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
      toast.error("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("repairRequests");
    if (storedData) {
      setRepairRequests(JSON.parse(storedData));
    }
    fetchRepairRequests();
  }, []);

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await fetchRepairRequests();
  };


  const getTabCount = (tabKey: string) => {
    return repairRequests.filter((request) => {
      if (tabKey === "available") return request.status === "PENDING";
      if (tabKey === "assign") return request.status === "ASSIGNED";
      if (tabKey === "quote") return request.status === "QUOTED";
      if (tabKey === "in_progress") return request.status === "IN_PROGRESS";
      if (tabKey === "completed") return request.status === "COMPLETED";
      if (tabKey === "rejected") return request.status === "REJECTED";
      return false;
    }).length;
  };

  const tabs = [
    { label: "الطلبات المتاحة", key: "available", icon: <FaListAlt /> },
    { label: "الطلبات المستلمة", key: "assign", icon: <FaArchive /> },
    { label: "بانتظار الموافقة", key: "quote", icon: <FaSpinner /> },
    { label: "قيد الاصلاح", key: "in_progress", icon: <FaSpinner /> },
    { label: "الطلبات المنجزة", key: "completed", icon: <FaCheckCircle /> },
    { label: "الطلبات المرفوضة", key: "rejected", icon: <FaTimesCircle /> },
  ];

  const filteredRequests = repairRequests.filter((request) => {
    if (activeTab === "available") return request.status === "PENDING";
    if (activeTab === "assign") return request.status === "ASSIGNED";
    if (activeTab === "quote") return request.status === "QUOTED";
    if (activeTab === "in_progress") return request.status === "IN_PROGRESS";
    if (activeTab === "completed") return request.status === "COMPLETED";
    if (activeTab === "rejected") return request.status === "REJECTED";
    return false;
  });


  return (
    <div 
      className={`min-h-screen p-4 transition-all duration-300 ease-in-out ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white" 
          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800"
      }`}
    >

      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">طلبات الصيانة</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 rounded-full transition-all ${
              refreshing 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {refreshing ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <FaSync className="text-lg" />
            )}
          </button>
        </div>

        {/* قائمة التبويبات للأجهزة المحمولة */}
        <div className="md:hidden relative mb-4">
          <button 
            onClick={() => setIsTabMenuOpen(!isTabMenuOpen)}
            className="flex items-center justify-between w-full p-3 bg-white text-black rounded-lg shadow-md"
          >
            <FaBars />
            <span>{tabs.find(tab => tab.key === activeTab)?.label}</span>
          </button>
          {isTabMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-white text-black rounded-lg shadow-lg z-50">
              {tabs.map((tab) => {
                const tabCount = getTabCount(tab.key);
                return (
                  <button
                    key={tab.key}
                    className={`w-full flex items-center  justify-between p-3 border-b last:border-b-0 ${
                      activeTab === tab.key 
                        ? "bg-blue-500 text-black" 
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setIsTabMenuOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                    <span className="ml-2">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </div>
                    {tabCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {tabCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* التبويبات للأجهزة الكبيرة */}
        <div className="hidden md:block overflow-x-auto mb-6">
          <div className="flex space-x-2 justify-center">
            {tabs.map((tab) => {
              const tabCount = getTabCount(tab.key);
              return (
                <button
                  key={tab.key}
                  className={`relative flex items-center space-x-2 p-4 ml-3 rounded-lg transition-all ${
                    activeTab === tab.key
                      ? "bg-blue-500 text-white shadow-lg" 
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  
                  <span className="ml-2">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tabCount > 0 && (
                    <span className="absolute -top-0 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {tabCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <ClipLoader color={isDarkMode ? "white" : "blue"} size={50} />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-xl text-gray-500">
              لا توجد طلبات في هذا التبويب.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((request) => (
              <RepairRequestCard
                userRole={"TECHNICIAN"}
                key={request.id}
                request={request}
                statusMap={statusMap}
                onRequestUpdated={fetchRepairRequests}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairRequests;