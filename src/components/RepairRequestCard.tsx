// src\components\RepairRequestCard.tsx

import React, { useContext, useState } from "react";
import { ThemeContext } from "@/app/context/ThemeContext";
import { RepairRequest } from "../utils/types";
import Modal from "react-modal";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  Dice1Icon, 
  MapPinIcon, 
  PhoneIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon 
} from 'lucide-react';
import PricingForm from "./forms/costform";

interface RepairRequestCardProps {
  request: RepairRequest;
  statusMap: { [key: string]: string };
  userRole: "ADMIN" | "SUB_ADMIN" | "USER" | "TECHNICIAN";
  onRequestUpdated: () => void;
}

const RepairRequestCard: React.FC<RepairRequestCardProps> = ({
  request,
  statusMap,
  userRole,
  onRequestUpdated,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getButtonLabel = () => {
    if (userRole === "TECHNICIAN") {
      if (request.status === "ASSIGNED" && request.isPaidCheckFee === true) {
        return "تسعير الطلب";
      } else if (request.status === "IN_PROGRESS") {
        return "تسليم المهمة";
      } else if (request.status === "PENDING") {
        return "استلام المهمة";
      }
      return null;
    } else if (userRole === "USER" && request.status === "PENDING") {
      return "حذف";
    }
    return null;
  };

  const handleButtonClick = () => {
    if (userRole === "TECHNICIAN" && request.status === "ASSIGNED") {
      setIsModalOpen(true);
    } else if (userRole === "TECHNICIAN" && request.status === "IN_PROGRESS") {
      handleSubmitTask();
    } else if (userRole === "TECHNICIAN" && request.status === "PENDING") {
      handleReceiveTask();
    } else {
      handleDeleteRequest();
    }
  };

  const handleReceiveTask = async () => {
    setIsProcessing(true); // تفعيل حالة التحميل
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await axios.put(
        `${API_BASE_URL}/maintenance-requests/${request.id}/assign`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم استلام المهمة بنجاح");
        onRequestUpdated();
      } else {
        toast.error("فشل في استلام المهمة");
      }
    } catch (error) {
      toast.error("خطأ في استلام المهمة");
      console.error("خطأ في استلام المهمة", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitTask = async () => {
    setIsProcessing(true);
    try {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      const response = await axios.put(
        `${API_BASE_URL}/maintenance-requests/${request.id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("تم تسليم المهمة بنجاح");
        onRequestUpdated();
      } else {
        toast.error("فشل في تسليم المهمة");
      }
    } catch (error) {
      toast.error("خطأ في تسليم المهمة");
      console.error("خطأ في تسليم المهمة", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteRequest = async () => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذا الطلب؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setIsDeleting(true);
            try {
              const token = document.cookie.replace(
                /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
                "$1"
              );

              const response = await axios.delete(
                `${API_BASE_URL}/maintenance-requests/${request.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.status === 200) {
                toast.success("تم حذف الطلب بنجاح");

                // تحديث البيانات في localStorage
                const storedData = localStorage.getItem("repairRequests");
                if (storedData) {
                  const parsedData = JSON.parse(storedData);
                  console.log("قبل الحذف من localStorage:", parsedData);

                  const updatedData = parsedData.filter(
                    (item: RepairRequest) => item.id !== request.id
                  );

                  console.log("بعد الحذف من localStorage:", updatedData);

                  localStorage.setItem(
                    "repairRequests",
                    JSON.stringify(updatedData)
                  );

                  // تحقق من البيانات في localStorage
                  const newStoredData = localStorage.getItem("repairRequests");
                  console.log(
                    "البيانات المحدثة في localStorage:",
                    JSON.parse(newStoredData || "[]")
                  );
                }

                // تحديث الطلبات في الواجهة
                onRequestUpdated();
              } else {
                toast.error("فشل في حذف الطلب");
              }
            } catch (error) {
              toast.error("خطأ في حذف الطلب");
              console.error("خطأ في حذف الطلب", error);
            } finally {
              setIsDeleting(false);
            }
          },
        },
        {
          label: "لا",
          onClick: () => {
            toast.info("تم إلغاء الحذف");
          },
        },
      ],
    });
  };


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStatusColor = (status:any) => {
    const statusColorMap = {
      "COMPLETED": "text-green-500",
      "IN_PROGRESS": "text-yellow-500",
      "REJECTED": "text-red-500",
      "QUOTED": "text-purple-500",
      "ASSIGNED": "text-orange-500",
      "PENDING": "text-gray-500",
      "DEFAULT": "text-blue-500"
    };
    return statusColorMap[status] || statusColorMap["DEFAULT"];
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        max-w-sm w-full rounded-2xl shadow-2xl overflow-hidden mb-6 transform transition-all 
        ${isDarkMode 
          ? 'bg-gray-900 text-white border border-gray-800' 
          : 'bg-white text-gray-900 border border-gray-100'
        }
      `}
    >
      {/* Device Image */}
      <div className="relative">
        <img
          src={
            typeof request.deviceImage === "string"
              ? request.deviceImage
              : "/assets/images/default-device.png"
          }
          alt={String(request.deviceType) || "Unknown device"}
          className="w-full h-56 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-3 text-white">
          <h2 className="text-xl font-bold">
            {userRole === "TECHNICIAN"
              ? "طلب صيانة"
              : request.user && request.user.fullName
              ? String(request.user.fullName)
              : "اسم غير معروف"}
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <div className="space-y-4">
          {/* Location & Device Info */}
          <div className="flex justify-between items-center border-b pb-3">
            <div className="flex items-center space-x-2">
              <MapPinIcon size={20} className="text-blue-500 ml-3" />
              <strong>{String(request.governorate) || "غير محدد"}</strong>
            </div>
            <div className="flex items-center space-x-2">
              <Dice1Icon size={20} className="text-green-500 ml-3" />
              <span>{String(request.deviceType) || "غير محدد"}</span>
            </div>
          </div>

          {/* Device Model */}
          <div className="border-b pb-3">
            <strong className="text-gray-600 dark:text-gray-300">
              موديل الجهاز: {String(request.deviceModel) || "غير معروف"}
            </strong>
          </div>

          {/* Status */}
          <div className="border-b pb-3 flex justify-between items-center">
            <strong>الحالة:</strong>
            <span className={`font-bold ${getStatusColor(request.status)}`}>
              {statusMap[request.status] || "حالة غير معروفة"}
            </span>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {userRole !== "TECHNICIAN" && (
                  <div className="border-b pb-3 flex items-center space-x-2">
                    <PhoneIcon size={20} className="text-green-500 ml-3" />
                    <span>{String(request.user.phoneNO) || "غير متوفر"}</span>
                  </div>
                )}

                <div className="border-b pb-3">
                  <strong>وصف المشكلة:</strong>
                  <p>{String(request.problemDescription) || "غير متوفر"}</p>
                </div>

                {/* Cost & Payment Details */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <strong>التكلفة:</strong>
                    <span>
                      {request.cost === 0
                        ? "غير مسعر بعد"
                        : String(request.cost) || "غير متوفر"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <strong>أجور الكشف:</strong>
                    <span 
                      className={`flex items-center ${
                        request.isPaidCheckFee 
                          ? "text-green-500" 
                          : "text-red-500"
                      }`}
                    >
                      {request.isPaidCheckFee ? (
                        <CheckCircleIcon size={16} className="ml-2" />
                      ) : (
                        <XCircleIcon size={16} className="ml-2" />
                      )}
                      {request.isPaidCheckFee ? "تم الدفع" : "لم يتم الدفع"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <strong>الأجور:</strong>
                    <span 
                      className={`flex items-center ${
                        request.isPaid 
                          ? "text-green-500" 
                          : "text-red-500"
                      }`}
                    >
                      {request.isPaid ? (
                        <CheckCircleIcon size={16} className="ml-2" />
                      ) : (
                        <XCircleIcon size={16} className="ml-2" />
                      )}
                      {request.isPaid ? "تم الدفع" : "لم يتم الدفع"}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            {isExpanded ? (
              <>
                <ChevronUpIcon size={20} className="ml-2" />
                عرض أقل
              </>
            ) : (
              <>
                <ChevronDownIcon size={20} className="ml-2" />
                عرض المزيد
              </>
            )}
          </motion.button>

          {getButtonLabel() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-lg text-white transition-all
                ${
                  isDeleting || isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : getButtonLabel() === "حذف"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              `}
              onClick={handleButtonClick}
              disabled={isDeleting || isProcessing}
            >
              {isDeleting || isProcessing ? (
                <div className="flex items-center">
                  <AlertCircleIcon size={20} className="ml-2 animate-pulse" />
                  جار المعالجة...
                </div>
              ) : (
                getButtonLabel()
              )}
            </motion.button>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Form Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <PricingForm
          requestId={String(request.id)}
          onClose={() => setIsModalOpen(false)}
          onRequestUpdated={onRequestUpdated}
        />
      </Modal>
    </motion.div>
      </>
  );
};

export default RepairRequestCard;
