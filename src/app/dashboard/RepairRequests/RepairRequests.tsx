// src\app\dashboard\RepairRequests\RepairRequests.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { ThemeContext } from "@/app/context/ThemeContext";
import Tabs from "@/components/Tabs";
import { ClipLoader } from "react-spinners";
import RepairRequestCard from "@/components/RepairRequestCard";
// import RepairRequestButton from "@/components/requestbutton";
import { RepairRequest } from "@/utils/types";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import PullToRefresh from "react-pull-to-refresh";
import { FaAngleDoubleDown, FaSync } from "react-icons/fa";

const RepairRequests: React.FC = () => {
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [, setLoading] = useState<boolean>(false);
  const [, setIsRefreshing] = useState<boolean>(false);
  // const { isDarkMode } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<string>("available");
  const [refreshing, ] = useState<boolean>(false);

  // للتعامل مع السحب
  const statusMap: { [key: string]: string } = {
    PENDING: "قيد الانتظار",
    IN_PROGRESS: "جارٍ التنفيذ",
    COMPLETED: "مكتمل",
    REJECTED: "مرفوض",
    ASSIGNED: "قيد التسعير",
    QUOTED: "انتظار القبول",
  };

  // تعريف التبويبات
  const tabs = [
    { label: "جميع الطلبات", key: "available" },
    { label: " الطلبات المعلقة", key: "pending" },
    { label: "قيد التسعير", key: "assigned" },
    { label: "قيد الاصلاح", key: "in_progress" },
    { label: "الطلبات المنجزة", key: "completed" },
    { label: "الطلبات المرفوضة", key: "rejected" },
  ];

  // دالة لجلب البيانات من الخادم أو من الـ localStorage إذا كانت موجودة
  const fetchRepairRequests = async () => {
    setLoading(true);
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const response = await axios.get<RepairRequest[]>(
        `${API_BASE_URL}/maintenance-requests/all/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setRepairRequests(response.data);

        if (typeof window !== "undefined") {
          localStorage.setItem("repairRequests", JSON.stringify(response.data)); // حفظ البيانات في localStorage
        }

        toast.success("تم تحديث الطلبات بنجاح.");
      } else {
        console.warn("البيانات المستلمة ليست مصفوفة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب البيانات:", error);
      toast.error("حدث خطأ أثناء جلب البيانات.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // تحميل البيانات من localStorage عند التحميل الأول
  useEffect(() => {
    const storedRequests = localStorage.getItem("repairRequests");
    if (storedRequests) {
      setRepairRequests(JSON.parse(storedRequests));
    } else {
      fetchRepairRequests();
    }
  }, []);

  // التصفية حسب التبويب النشط
  const getFilteredRequests = (): RepairRequest[] => {
    switch (activeTab) {
      case "pending":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "PENDING"
        );
      case "assigned":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "ASSIGNED"
        );
      case "in_progress":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "IN_PROGRESS"
        );
      case "completed":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "COMPLETED"
        );
      case "rejected":
        return repairRequests.filter(
          (req) => req.status.toUpperCase() === "REJECTED"
        );
      case "available":
      default:
        return repairRequests;
    }
  };

  const filteredRequests = getFilteredRequests();

  // التعامل مع السحب
  const handleRefresh = async (): Promise<void> => {
    setIsRefreshing(true);
    await fetchRepairRequests();
  };

  return (
    <div className="flex mt-5 flex-col w-full" style={{ minHeight: "90vh" }}>
      {/* حاوية ثابتة شفافة للسحب للتحديث */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="fixed top-0 left-0 right-0 z-10 flex justify-center">
          <FaAngleDoubleDown className="mt-4 text-2xl text-yellow-500 animate-bounce md:hidden" />
        </div>
      </PullToRefresh>
      <div className="flex justify-between items-center mb-4">
        {/* <RepairRequestButton update={fetchRepairRequests} /> */}
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

      <div className="w-full flex-grow p-2 rounded">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="p-2 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredRequests.length === 0 ? (
            <p>لا توجد طلبات في هذا التبويب.</p>
          ) : (
            filteredRequests.map((request) => (
              <RepairRequestCard
                userRole={"USER"}
                key={request.id}
                request={request}
                statusMap={statusMap}
                onRequestUpdated={handleRefresh}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairRequests;
