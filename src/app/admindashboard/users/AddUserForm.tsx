// src\app\admindashboard\users\AddUserForm.tsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../../context/ThemeContext";
import { User, Phone, Mail, MapPin, Lock } from "lucide-react";

interface AddUserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  onClose: () => void;
}

interface UserFormData {
  fullName: string;
  phoneNO: string;
  email: string;
  governorate: string;
  address: string;
  role: "USER" | "SUBADMIN" | "TECHNICAL" | "ADMIN";
  specialization?: string;
  services?: string;
  admin_governorate?: string;
  password: string;
}

interface Service {
  title: string;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: "",
    phoneNO: "",
    email: "",
    governorate: "",
    address: "",
    role: "USER",
    password: "",
    admin_governorate: "",
    specialization: "",
    services: "",
  });

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isDarkMode } = useContext(ThemeContext);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/services`)
      .then((response) => {
        if (response.data.services && Array.isArray(response.data.services)) {
          const titles = response.data.services.map(
            (service: Service) => service.title
          );
          setSpecializations(titles);
        }
      })
      .catch((error) => console.error("فشل في جلب الخدمات:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName) {
      newErrors.fullName = "يجب إدخال الاسم الكامل.";
    }

    if (!formData.phoneNO) {
      newErrors.phoneNO = "رقم الهاتف مطلوب.";
    } else if (!/^\d{10}$/.test(formData.phoneNO)) {
      newErrors.phoneNO = "ادخل رقم هاتف صالح";
    }

    if (!formData.email) {
      newErrors.email = "البريد الإلكتروني مطلوب.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح.";
    }
    if (!formData.address) {
      newErrors.address = "العنوان مطلوب.";
    } else if (formData.address.length < 10) {
      newErrors.address = "يجب أن يكون العنوان أكثر من 10 أحرف.";
    }

    if (!formData.password) {
      newErrors.password = "كلمة المرور مطلوبة.";
    } else if (formData.password.length < 8) {
      newErrors.password = "يجب أن تكون كلمة المرور أكثر من 8 أحرف.";
    }

    if (formData.role === "TECHNICAL") {
      if (!formData.specialization) {
        newErrors.specialization = "يجب اختيار الاختصاص.";
      }

      if (!formData.services) {
        newErrors.services = "يجب إدخال الخدمات.";
      }
    }
    if (formData.role === "SUBADMIN") {
      if (!formData.admin_governorate) {
        newErrors.admin_governorate = "حدد قطاع العمل";
      }
    }

    setErrors(newErrors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      toast.success("تم إضافة المستخدم بنجاح!");
      onClose();
    } catch (error) {
      console.error("خطأ أثناء إضافة المستخدم:", error);
      toast.error("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div
        className={`
            p-6
            ${isDarkMode ? "bg-gray-700" : "bg-blue-50"}
            border-b border-gray-200
          `}
      >
        <h2
          className={`
              text-2xl font-bold text-center 
              ${isDarkMode ? "text-white" : "text-gray-800"}
            `}
        >
          إضافة مستخدم جديد
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`
            grid grid-cols-1 md:grid-cols-2 gap-6 p-6
            ${isDarkMode ? "text-gray-200" : "text-gray-800"}
          `}
      >
        {/* Full Name Input */}
        <div className="relative">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            الاسم الكامل
          </label>
          <div className="relative">
            <User
              className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  w-5 h-5
                `}
            />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`
                  w-full pl-10 pr-3 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition duration-300
                `}
              placeholder="أدخل الاسم الكامل"
            />
          </div>
          {errors.fullName && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.fullName}
            </span>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="relative">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            رقم الهاتف
          </label>
          <div className="relative">
            <Phone
              className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  w-5 h-5
                `}
            />
            <input
              type="text"
              name="phoneNO"
              value={formData.phoneNO}
              onChange={handleChange}
              className={`
                  w-full pl-10 pr-3 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition duration-300
                `}
              placeholder="أدخل رقم الهاتف"
            />
          </div>
          {errors.phoneNO && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.phoneNO}
            </span>
          )}
        </div>

        {/* Email Input */}
        <div className="relative">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail
              className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  w-5 h-5
                `}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`
                  w-full pl-10 pr-3 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition duration-300
                `}
              placeholder="أدخل البريد الإلكتروني"
            />
          </div>
          {errors.email && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.email}
            </span>
          )}
        </div>

        {/* Governorate Select */}
        <div className="relative">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            المحافظة
          </label>
          <div className="relative">
            <MapPin
              className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  w-5 h-5
                `}
            />
            <select
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              className={`
                  w-full pl-10 pr-3 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition duration-300
                `}
            >
              <option value="">اختر المحافظة</option>
              <option value="دمشق">دمشق</option>
              <option value="ريف دمشق">ريف دمشق</option>
              <option value="حمص">حمص</option>
              <option value="حماه">حماه</option>
              <option value="طرطوس">طرطوس</option>
              <option value="اللاذقية">اللاذقية</option>
              <option value="السويداء">السويداء</option>
              <option value="القنيطرة">القنيطرة</option>
              <option value="حلب">حلب</option>
              <option value="الرقة">الرقة</option>
              <option value="الحسكة">الحسكة</option>
              <option value="دير الزور">دير الزور</option>
              <option value="ادلب">ادلب</option>
            </select>
          </div>
        </div>

        {/* Address Input */}
        <div className="relative md:col-span-2">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            العنوان التفصيلي
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`
                w-full px-3 py-2 rounded-lg
                ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }
                border focus:outline-none focus:ring-2 focus:ring-blue-500
                transition duration-300
              `}
            placeholder="أدخل العنوان التفصيلي"
          />
          {errors.address && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.address}
            </span>
          )}
        </div>

        {/* Role Select */}
        <div className="relative">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            نوع المستخدم
          </label>
          <div className="relative">
            {/* <ChevronDown 
                className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                  w-5 h-5
                `} 
              /> */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`
                  w-full pl-10 pr-3 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition duration-300
                `}
            >
              <option value="USER">مستخدم</option>
              <option value="TECHNICAL">تقني</option>
              {userRole === "ADMIN" && <option value="ADMIN">مدير</option>}
              {userRole === "ADMIN" && (
                <option value="SUBADMIN">مدير محافظة</option>
              )}
            </select>
          </div>
        </div>

        {/* Password Input */}
        <div className="relative">
          <label
            className={`
                block mb-2 text-sm font-medium
                ${isDarkMode ? "text-gray-300" : "text-gray-700"}
              `}
          >
            كلمة المرور
          </label>
          <div className="relative">
            <Lock
              className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  w-5 h-5
                `}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`
                  w-full pl-10 pr-3 py-2 rounded-lg
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-300"
                  }
                  border focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition duration-300
                `}
              placeholder="أدخل كلمة المرور"
            />
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm mt-1 block">
              {errors.password}
            </span>
          )}
        </div>

        {/* Additional Role-Specific Fields */}
        {/* (Keep the existing conditional rendering for TECHNICAL and SUBADMIN roles) */}

        {formData.role === "TECHNICAL" && (
          <>
            <div className="mb-4">
              <label className="block">الاختصاص:</label>
              <select
                name="specialization"
                onChange={handleChange}
                className={`
                    w-full pl-10 pr-3 py-2 rounded-lg
                    ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }
                    border focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition duration-300
                  `}
              >
                <option value="">اختر الاختصاص</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <span className="text-red-600">{errors.specialization}</span>
              )}
            </div>

            <div className="mb-4">
              <label className="block">الخدمات:</label>
              <input
                type="text"
                name="services"
                value={formData.services}
                onChange={handleChange}
                className={`
                    w-full pl-10 pr-3 py-2 rounded-lg
                    ${
                      isDarkMode
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }
                    border focus:outline-none focus:ring-2 focus:ring-blue-500
                    transition duration-300
                  `}
              />
              {errors.services && (
                <span className="text-red-600">{errors.services}</span>
              )}
            </div>
          </>
        )}
        {formData.role === "SUBADMIN" && (
          <>
            <div className="mb-4">
              <label className="block">قطاع العمل:</label>
              <div className="relative">
                <MapPin
                  className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2
                  ${isDarkMode ? "text-gray-400" : "text-gray-500"}
                  w-5 h-5
                `}
                />
                <select
                  name="admin_governorate"
                  value={formData.admin_governorate}
                  onChange={handleChange}
                  required
                  className={`
                      w-full pl-10 pr-3 py-2 rounded-lg
                      ${
                        isDarkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }
                      border focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition duration-300
                    `}
                >
                  <option value="">اختر المحافظة</option>
                  <option value="دمشق">دمشق</option>
                  <option value="ريف دمشق">ريف دمشق</option>
                  <option value="حمص">حمص</option>
                  <option value="حماه">حماه</option>
                  <option value="طرطوس">طرطوس</option>
                  <option value="اللاذقية">اللاذقية</option>
                  <option value="السويداء">السويداء</option>
                  <option value="القنيطرة">القنيطرة</option>
                  <option value="حلب">حلب</option>
                  <option value="الرقة">الرقة</option>
                  <option value="الحسكة">الحسكة</option>
                  <option value="دير الزور">دير الزور</option>
                  <option value="ادلب">ادلب</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="md:col-span-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`
                w-full py-3 rounded-lg text-white font-bold
                ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }
                transition duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-blue-500
                ${loading ? "opacity-50 cursor-not-allowed" : ""}
              `}
          >
            {loading ? "جارٍ الإضافة..." : "إضافة مستخدم"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUserForm;
