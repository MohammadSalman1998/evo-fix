// src\components\requestbutton.tsx
import React, { useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/context/ThemeContext";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  Home,
  Smartphone,
  FileText,
  Camera,
  Upload,
} from "lucide-react";
import {
  MapPin,
  Phone,
  X,
  Wrench,
} from "lucide-react";

interface Service {
  id: string;
  title: string;
  DevicesModels: { id: string; title: string }[];
}
interface requestbuttonProps {
  update: () => void;
}

const RepairRequestButton: React.FC<requestbuttonProps> = ({ update }) => {
  const { isLoggedIn } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);
  const [governorate, setGovernorate] = useState("");
  const [phoneNO, setPhoneNO] = useState("");
  const [address, setAddress] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [deviceModels, setDeviceModels] = useState<
    { id: string; title: string }[]
  >([]);
  const [problemDescription, setProblemDescription] = useState("");
  const [deviceImage, setDeviceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [hasFetchedServices, setHasFetchedServices] = useState(false); // new state to track if services are fetched

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setDeviceImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };
  const router = useRouter();

  const removeImage = () => {
    setDeviceImage(null);
    setImagePreview(null);
  };

  const DeviceTypeSelector: React.FC<{
    deviceType: string;
    setDeviceType: (type: string) => void;
    setDeviceModels: (models: { id: string; title: string }[]) => void;
  }> = ({ deviceType, setDeviceType, setDeviceModels }) => {
    const fetchServices = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const response = await axios.get(`${API_BASE_URL}/services`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setServices(response.data.services || []);
        setHasFetchedServices(true); // Mark services as fetched
      } catch (error) {
        console.error("حدث خطأ أثناء جلب الخدمات:", error);
      }
    };

    useEffect(() => {
      if (isModalOpen && !hasFetchedServices) {
        fetchServices(); // Fetch services only if not already fetched
      }
    }, [isModalOpen, hasFetchedServices]); // Dependency array now includes `hasFetchedServices`

    const handleDeviceTypeChange = (type: string) => {
      setDeviceType(type);
      // العثور على الخدمة المحددة وتحديث الموديلات المرتبطة بها
      const selectedService = services.find(
        (service) => service.title === type
      );
      setDeviceModels(selectedService ? selectedService.DevicesModels : []);
      setDeviceModel(""); // مسح الموديل المحدد عند تغيير نوع الجهاز
    };

    return (
      <div className="mb-4">
        <label className="block">نوع الجهاز</label>
        <select
          value={deviceType}
          onChange={(e) => handleDeviceTypeChange(e.target.value)}
          className={`w-full p-3 pl-10 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
              : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
          }`}
          required
        >
          <option value="">اختر نوع الجهاز</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const openModal = () => {
    if (!isLoggedIn) {
      router.push("/login"); // تحويل المستخدم إلى صفحة تسجيل الدخول
    } else {
      setIsModalOpen(true); // فتح النافذة إذا كان المستخدم مسجلًا
    }
  };
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = Cookies.get("token");

    const formData = new FormData();
    formData.append("governorate", governorate);
    formData.append("phoneNO", phoneNO);
    formData.append("address", address);
    formData.append("deviceType", deviceType);
    formData.append("deviceModel", deviceModel);
    formData.append("problemDescription", problemDescription);

    if (deviceImage) {
      formData.append("deviceImage", deviceImage);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/maintenance-requests`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      update();
      if (response.status >= 200 && response.status <= 299) {
        // الطلب ناجح
        toast.success("تم إرسال الطلب بنجاح!");
        setGovernorate("");
        setPhoneNO("");
        setAddress("");
        setDeviceType("");
        setDeviceModel("");
        setProblemDescription("");
        removeImage();
        closeModal();
      } else {
        // إذا كان الكود خارج النطاق الناجح
        console.log("فشل في إرسال الطلب");
        toast.error("فشل في إرسال الطلب");
      }
    } catch (error) {
      // تحقق مما إذا كان الخطأ يحتوي على استجابة من الخادم
      if (axios.isAxiosError(error) && error.response) {
        const { message, suggestions } = error.response.data;

        // عرض الرسالة الأساسية من الخادم
        toast.error(message || "حدث خطأ أثناء إرسال الطلب");

        // إذا كانت هناك اقتراحات، عرضها واحدة تلو الأخرى
        if (suggestions && Array.isArray(suggestions)) {
          suggestions.forEach((suggestion) =>
            toast.error(`اقتراح: ${suggestion}`)
          );
        }
      } else {
        // في حال كان الخطأ عام وغير متصل بالخادم
        console.error("حدث خطأ:", error);
        toast.error("حدث خطأ أثناء إرسال الطلب");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 10000 }}
      />

      {/* Floating Request Button */}
      <button
        onClick={openModal}
        className={`fixed bottom-6 left-6 flex items-center justify-center p-4 text-sm font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 z-50 group ${
          isDarkMode
            ? "bg-gradient-to-br from-blue-700 to-blue-500 text-white hover:from-blue-600 hover:to-blue-400 focus:ring-blue-400"
            : "bg-gradient-to-br from-blue-500 to-blue-300 text-white hover:from-blue-400 hover:to-blue-200 focus:ring-blue-200"
        }`}
      >
        <Wrench className="ml-2 group-hover:rotate-45 transition-transform" />
        طلب إصلاح
      </button>

      {/* Modal */}
      {isLoggedIn && isModalOpen && (
        <div className="fixed  inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div
            className={`w-11/12  sm:w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 transform transition-all duration-300 ease-in-out ${
              isDarkMode
                ? "bg-gray-900 text-white border border-gray-800"
                : "bg-white text-gray-800 border border-gray-200"
            }`}
          >
            <div className="mt-10 flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center">
                <Wrench className="ml-3 text-blue-500" />
                طلب إصلاح جهاز
              </h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Governorate Selector */}
              <div>
                <label className="flex items-center mb-2 text-sm font-medium">
                  <MapPin className="ml-2 text-blue-500" size={20} />
                  المحافظة
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                      : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
                  }`}
                  required
                >
                  <option value="">اختر المحافظة</option>
                  <option value="دمشق">دمشق</option>
                  <option value="ريف دمشق">ريف دمشق</option>
                  <option value="درعا">درعا</option>
                  <option value="حمص">حمص</option>
                  <option value="حماه">حماه</option>
                  <option value="طرطوس">طرطوس</option>
                  <option value="اللاذقية">اللاذقية</option>
                  <option value="السويداء">السويداء</option>
                  <option value="القنيطرة">القنيطرة</option>
                  <option value="حلب">حلب</option>
                  <option value="الرقة">الرقة</option>
                  <option value="دير الزور">دير الزور</option>
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center mb-2 text-sm font-medium">
                  <Phone className="ml-2 text-blue-500" size={20} />
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={phoneNO}
                  onChange={(e) => setPhoneNO(e.target.value)}
                  className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                      : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
                  }`}
                  required
                />
              </div>

              {/* Address Input */}
              <div>
                <label className="flex items-center mb-2 text-sm font-medium">
                  <Home className="ml-2 text-blue-500" size={20} />
                  العنوان
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                      : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
                  }`}
                  required
                />
              </div>
              <DeviceTypeSelector
                deviceType={deviceType}
                setDeviceType={setDeviceType}
                setDeviceModels={setDeviceModels}
              />
              {/* Device Model Selector */}
              <div>
                <label className="flex items-center mb-2 text-sm font-medium">
                  <Smartphone className="ml-2 text-blue-500" size={20} />
                  الموديل
                </label>
                <div className="relative">
                  <select
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                        : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
                    }`}
                    required
                  >
                    <option value="">اختر الموديل</option>
                    {deviceModels.map((model) => (
                      <option
                        key={model.id}
                        value={model.title}
                        
                      >
                        {model.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="flex items-center mb-2 text-sm font-medium">
                  <FileText className="ml-2 text-blue-500" size={20} />
                  وصف المشكلة
                </label>
                <textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  rows={4}
                  className={`w-full p-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 resize-none ${
                    isDarkMode
                      ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600"
                      : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
                  }`}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="flex items-center mb-2 text-sm font-medium">
                  <Camera className="ml-2 text-blue-500" size={20} />
                  صورة الجهاز (اختياري)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-opacity-10 transition-all duration-300 ${
                      isDarkMode
                        ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                        : "border-gray-300 bg-white hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        اختر صورة للجهاز أو اسحبها وأفلتها هنا
                      </p>
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 relative">
                    <Image
                      src={imagePreview}
                      alt="صورة الجهاز"
                      className="w-full h-auto rounded-xl shadow-md"
                      width={300}
                      height={300}
                    />
                    <button
                      onClick={removeImage}
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-xl text-white transition-all duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                  }`}
                >
                  {isLoading ? "جاري الإرسال..." : "إرسال الطلب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RepairRequestButton;
