// src\components\forms\DeviceModelForm.tsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import { Service, DeviceModel } from "@/utils/types";
import { ThemeContext } from "@/app/context/ThemeContext";

interface DeviceModelFormProps {
  initialData?: DeviceModel | null;
  onSubmit: (data: DeviceModel) => Promise<void>;
  isActive: boolean;
  onClose: () => void;
  services: Service[];
}

const DeviceModelForm: React.FC<DeviceModelFormProps> = ({
  initialData,
  onSubmit,
  onClose,
  isActive, // استقبال isActive من المكون الأب
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [serviceID, setServiceID] = useState(initialData?.serviceID || 0);
  const [active, setActive] = useState(isActive); // حقل لحالة النشاط
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await axios.get(`${API_BASE_URL}/services`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setServices(response.data.services || []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("حدث خطأ أثناء جلب الخدمات.");
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        id: initialData ? initialData.id : 0,
        title,
        serviceID,
        createAt: new Date().toISOString(),
        isActive: active, // إرسال حالة النشاط
        services: [],
      });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء حفظ البيانات.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div 
      className={`
        max-w-md mx-auto rounded-2xl shadow-2xl transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'}
      `}
    >

      <form 
        onSubmit={handleSubmit} 
        className={`
          p-8 space-y-6 
          ${isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200'}
        `}
      >
        <h2 className={`
          text-2xl font-bold text-center pb-4 border-b-2
          ${isDarkMode 
            ? 'border-gray-700 text-white' 
            : 'border-gray-300 text-gray-800'}
        `}>
          {initialData ? 'تعديل الموديل' : 'إضافة موديل جديد'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">العنوان</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`
                w-full px-4 py-3 rounded-lg transition-all duration-300 
                ${isDarkMode 
                  ? 'bg-gray-700 text-white focus:ring-2 focus:ring-blue-600' 
                  : 'bg-white text-gray-800 focus:ring-2 focus:ring-blue-400'}
              `}
              placeholder="أدخل العنوان"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">الخدمة</label>
            <div className="relative">
              <select
                value={serviceID}
                onChange={(e) => setServiceID(Number(e.target.value))}
                required
                className={`
                  w-full px-4 py-3 rounded-lg appearance-none transition-all duration-300
                  ${isDarkMode 
                    ? 'bg-gray-700 text-white focus:ring-2 focus:ring-blue-600' 
                    : 'bg-white text-gray-800 focus:ring-2 focus:ring-blue-400'}
                `}
              >
                <option value="">اختر خدمة</option>
                {services.map((service) => (
                  <option 
                    key={service.id} 
                    value={service.id}
                    className={`
                      ${isDarkMode 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-white text-gray-800'}
                    `}
                  >
                    {service.title}
                  </option>
                ))}
              </select>
              <div 
                className={`
                  pointer-events-none absolute inset-y-0 left-0 flex items-center px-2
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                `}
              >
                <svg 
                  className="fill-current h-4 w-4" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="activeCheckbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className={`
                h-5 w-5 rounded focus:ring-2 transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 text-blue-600 focus:ring-blue-600' 
                  : 'bg-white text-blue-500 focus:ring-blue-400'}
              `}
            />
            <label 
              htmlFor="activeCheckbox" 
              className="text-sm font-medium"
            >
              الموديل نشط
            </label>
          </div>
        </div>

        <div className="flex justify-between space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className={`
              flex-1 py-3 rounded-lg transition-all duration-300
              ${isDarkMode 
                ? 'bg-gray-700 text-white hover:bg-gray-600' 
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}
            `}
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`
              flex-1 py-3 rounded-lg transition-all duration-300 flex items-center justify-center
              ${loading 
                ? 'opacity-50 cursor-not-allowed' 
                : (isDarkMode 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600')
              }
            `}
          >
            {loading ? (
              <div className="flex items-center">
                <svg 
                  className="animate-spin h-5 w-5 mr-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جارٍ الحفظ...
              </div>
            ) : (
              "حفظ"
            )}
          </button>
        </div>
      </form>
    </div>
  );


  // return (
  //   <form
  //     onSubmit={handleSubmit}
  //     className="p-5 bg-gray-800 rounded border border-yellow-600 text-white"
  //   >
  //     <div className="mb-4">
  //       <label className="block text-sm font-medium">العنوان</label>
  //       <input
  //         type="text"
  //         value={title}
  //         onChange={(e) => setTitle(e.target.value)}
  //         required
  //         className="mt-1 p-2 block w-full border text-black rounded-md shadow-sm focus:ring focus:ring-opacity-50"
  //       />
  //     </div>

  //     <div className="mb-4">
  //       <label className="block text-sm font-medium">الخدمة</label>
  //       <select
  //         value={serviceID}
  //         onChange={(e) => setServiceID(Number(e.target.value))}
  //         required
  //         className="mt-1 p-2 block w-full border text-black rounded-md shadow-sm focus:ring focus:ring-opacity-50"
  //       >
  //         <option value="">اختر خدمة</option>
  //         {services.map((service) => (
  //           <option key={service.id} value={service.id}>
  //             {service.title}
  //           </option>
  //         ))}
  //       </select>
  //     </div>

  //     <div className="mb-4">
  //       <label className="inline ml-1 text-sm font-medium">الموديل نشط</label>
  //       <input
  //         type="checkbox"
  //         checked={active}
  //         onChange={(e) => setActive(e.target.checked)}
  //         className="mt-1"
  //       />
  //     </div>

  //     <div className="flex justify-between">
  //       <button
  //         type="button"
  //         onClick={onClose}
  //         className="bg-red-400 text-gray-700 px-4 py-2 rounded mr-2"
  //       >
  //         إلغاء
  //       </button>
  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className="bg-blue-500 text-white px-4 py-2 rounded"
  //       >
  //         {loading ? "جارٍ الحفظ..." : "حفظ"}
  //       </button>
  //     </div>
  //   </form>
  // );
};

export default DeviceModelForm;
