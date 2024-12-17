// src\app\admindashboard\DevicesModels.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { API_BASE_URL } from "@/utils/api";
import DeviceModelForm from "@/components/forms/DeviceModelForm";
import { ClipLoader } from "react-spinners";
import { Switch } from "@mui/material";
import { FiEdit, FiTrash, FiPlus, FiSun, FiMoon } from "react-icons/fi";
import { confirmAlert } from "react-confirm-alert";
import { DeviceModel } from "@/utils/types";
import { useRepairRequests } from "@/app/context/adminData";

const DevicesModels: React.FC = () => {
  const {
    deviceModels: contextDeviceModels,
    // fetchDeviceModels,
    isDeviceLoading,
  } = useRepairRequests();
  const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('theme');
    if (savedMode) return savedMode === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    // Apply dark mode to html element for global styling
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Apply theme on component mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  useEffect(() => {
    setDeviceModels(contextDeviceModels);
  }, [contextDeviceModels]);

  const handleSaveModel = async (data: DeviceModel) => {
    if (!data.title || !data.serviceID) {
      toast.error("الرجاء إدخال جميع البيانات المطلوبة");
      return;
    }
  
    try {
      const authToken = Cookies.get("token");
  
      if (selectedModel) {
        // Update existing model
        await axios.put(
          `${API_BASE_URL}/device-models/${selectedModel.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        toast.success("تم تعديل الموديل بنجاح!");
      } else {
        // Add new model
        const response = await axios.post(
          `${API_BASE_URL}/device-models`,
          data,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        toast.success(response.data.message || "تم إضافة الموديل بنجاح");
        setDeviceModels((prev) => [response.data.device_model, ...prev]);
      }
  
      setIsModalOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ غير متوقع، الرجاء المحاولة لاحقًا");
    }
  };

  const fetchDeviceModels = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/device-models`);
      setDeviceModels(response.data.DeviceModel || []);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب الموديلات");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDeviceModels();
  }, []);
  

  const handleEditModel = (model: DeviceModel) => {
    setSelectedModel(model);
    setIsModalOpen(true);
  };

  const confirmDeleteModel = (id: number) => {
    confirmAlert({
      title: "تاكيد الحذف",
      message: "هل انت متاكد من حذف الموديل ؟",
      buttons: [
        { label: "نعم", onClick: () => handleDeleteModel(id) },
        { label: "لا" },
      ],
    });
  };

  const handleDeleteModel = async (id: number) => {
    try {
      const authToken = Cookies.get("token");
  
      await axios.delete(`${API_BASE_URL}/device-models/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      toast.success("تم حذف الموديل بنجاح");
      setDeviceModels((prev) => prev.filter((model) => model.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };
  

  const handleToggleActive = async (model: DeviceModel) => {
    setLoading(true);
    try {
      const authToken = Cookies.get("token");
      const isActiveValue = !model.isActive;

      await axios.put(
        `${API_BASE_URL}/device-models/${model.id}`,
        { isActive: isActiveValue },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("تم تحديث حالة النشر!");

      // Update active status locally
      setDeviceModels((prev) =>
        prev.map((m) =>
          m.id === model.id ? { ...m, isActive: isActiveValue } : m
        )
      );
    } catch (error) {
      toast.error("حدث خطا غير متوقع.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  if (isDeviceLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-50 dark:bg-gray-900">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        {/* Mode Toggle Button */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleDarkMode}
            className="
              p-2 rounded-full 
              bg-gray-200 dark:bg-gray-700 
              text-gray-800 dark:text-gray-200
              hover:bg-gray-300 dark:hover:bg-gray-600
              transition-colors duration-300
            "
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">موديلات الاجهزة</h2>
          <button
            onClick={() => {
              setSelectedModel(null);
              setIsModalOpen(true);
            }}
            className="
              flex items-center 
              bg-blue-600 hover:bg-blue-700 
              dark:bg-blue-700 dark:hover:bg-blue-600 
              text-white px-4 py-2 
              rounded-lg transition-colors 
              duration-300 shadow-md
            "
          >
            <FiPlus className="ml-2" />
            اضافة موديل جديد
          </button>
        </div>

        {deviceModels.length > 0 ? (
          <div className="space-y-4">
            {deviceModels.map((model) => (
              <div
                key={model.id}
                className={`
                  flex flex-col md:flex-row justify-between 
                  p-5 border rounded-lg shadow-sm
                  ${model.isActive 
                    ? 'bg-white dark:bg-gray-700 border-blue-100 dark:border-blue-900' 
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-70'}
                  transition-all duration-300
                `}
              >
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{model.title}</h3>
                    <span
                      className={`
                        w-3 h-3 rounded-full mr-2 ml-2
                        ${model.isActive ? 'bg-green-500' : 'bg-red-500'}
                      `}
                    ></span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>الحالة: {model.isActive ? "فعال" : "غير فعال"}</p>
                    <p>
                      تاريخ الإنشاء{" "}
                      {model.createAt
                        ? new Date(model.createAt).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mt-4 md:mt-0 space-x-4">
                  <Switch
                    checked={model.isActive}
                    onChange={() => handleToggleActive(model)}
                    color="primary"
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditModel(model)}
                      disabled={loading}
                      className="
                        text-yellow-500 hover:text-yellow-600 
                        dark:text-yellow-400 dark:hover:text-yellow-500
                        transition-colors
                      "
                    >
                      <FiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => confirmDeleteModel(model.id)}
                      disabled={loading}
                      className="
                        text-red-500 hover:text-red-600 
                        dark:text-red-400 dark:hover:text-red-500
                        transition-colors
                      "
                    >
                      <FiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
           لا يوجد موديلات متاحة حاليا
          </div>
        )}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            ariaHideApp={false}
            className="fixed inset-0 flex items-center justify-center p-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
              <DeviceModelForm
                onSubmit={handleSaveModel}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedModel}
                services={selectedModel?.services || []}
                isActive={selectedModel ? !!selectedModel.isActive : false}
              />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default DevicesModels;