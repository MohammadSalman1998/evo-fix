// src\components\forms\UserForm.tsx
"use client";

import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { ThemeContext } from "@/app/context/ThemeContext";
// import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { UserFormInput } from "../../utils/types";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LoaderIcon,
} from "lucide-react";

// تعريف نوع props

interface UserFormProps {
  initialData?: UserFormInput;
  onSubmit: (data: UserFormInput) => Promise<void>;
  submitButtonLabel?: string;
  isNew?: boolean;
  isUser?: boolean;
  isTechnical?: boolean;
  isSubAdmin?: boolean;
  onClose?: () => void;
}

interface FormErrors {
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  password: string;
  confirmPassword: string;
  specialization?: string;
  services?: string;
  admin_governorate?: string;
}
interface Service {
  title: string;
}

type EditUserFormInput = Omit<UserFormInput, "password" | "confirmPassword">;

const UserForm: React.FC<UserFormProps> = ({
  initialData = {
    fullName: "",
    email: "",
    governorate: "",
    password: "",
    confirmPassword: "",
    phoneNO: "",
    address: "",
    specialization: "",
    services: "",
    admin_governorate: "",
  },
  onSubmit,
  submitButtonLabel = "التسجيل",
  isTechnical,
  isSubAdmin,
  isNew,
}) => {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };
  const { isDarkMode } = useContext(ThemeContext);
  const [currentStep, setCurrentStep] = useState(1);

  // تحديد النوع المناسب للـ formData بناءً على قيمة isNew
  const [formData, setFormData] = useState<UserFormInput | EditUserFormInput>(
    isNew
      ? initialData
      : { ...initialData, password: undefined, confirmPassword: undefined }
  );

  const [errors, setErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    phoneNO: "",
    governorate: "",
    address: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    services: "",
    admin_governorate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordR, setShowPasswordR] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [specializations, setSpecializations] = useState<string[]>([]);

  // Fetch specializations from the API
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      fullName: "",
      email: "",
      phoneNO: "",
      governorate: "",
      address: "",
      password: "",
      confirmPassword: "",
      specialization: "",
      services: "",
      admin_governorate: "",
    };

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب";
      if (!formData.email.includes("@"))
        newErrors.email = "البريد الإلكتروني غير صالح";
      if (!formData.phoneNO) newErrors.phoneNO = "رقم الهاتف مطلوب";
    } else if (currentStep === 2) {
      if (!formData.governorate) newErrors.governorate = "المحافظة مطلوبة";
      if (!formData.address || formData.address.length < 10)
        newErrors.address = "العنوان يجب أن يتجاوز 10 أحرف";
      if (isTechnical) {
        if (!formData.specialization)
          newErrors.specialization = "الاختصاص مطلوب";
        if (!formData.services) newErrors.services = "وصف الخدمة مطلوب";
      }
      if (isSubAdmin) {
        if (!formData.admin_governorate)
          newErrors.admin_governorate = "حدد محافظة العمل";
      }
    } else if (currentStep === 3 && isNew) {
      const { password, confirmPassword } = formData as UserFormInput;

      if (!password || !confirmPassword) {
        newErrors.password = password ? "" : "الرجاء إدخال كلمة المرور";
        newErrors.confirmPassword = confirmPassword
          ? ""
          : "الرجاء تأكيد كلمة المرور";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "كلمتا المرور غير متطابقتان";
      }
    }

    setErrors(newErrors);

    const isValid = Object.values(newErrors).every((error) => error === "");
    if (!isValid) {
      toast.error("يرجى تصحيح الأخطاء قبل المتابعة");
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (validateForm()) {
      // إنشاء بيانات النموذج حسب حالة `isNew`
      const filteredFormData = isNew
        ? formData // عند الإنشاء، نستخدم النموذج الكامل
        : ({
            ...formData,
            password: undefined,
            confirmPassword: undefined,
          } as Partial<UserFormInput>); // استخدام Partial لإزالة الحاجة لحقول كلمة المرور عند التعديل

      try {
        await onSubmit(filteredFormData as UserFormInput);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="fullName" className="block font-bold mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`
                  w-full 
                  pl-3 
                  pr-10 
                  py-3 
                  rounded-lg 
                  border 
                  focus:outline-none 
                  focus:ring-2 
                  transition-all 
                  duration-300
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                      : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                  } ${errors.fullName ? "border-red-500" : ""}`}
                required
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNO" className="block font-bold mb-2">
                رقم الهاتف
              </label>
              <input
                type="text"
                id="phoneNO"
                name="phoneNO"
                value={formData.phoneNO}
                onChange={handleChange}
                className={`
                  w-full 
                  pl-3 
                  pr-10 
                  py-3 
                  rounded-lg 
                  border 
                  focus:outline-none 
                  focus:ring-2 
                  transition-all 
                  duration-300
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                      : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                  } ${errors.phoneNO ? "border-red-500" : ""}`}
                required
              />
              {errors.phoneNO && (
                <p className="text-red-500 text-sm">{errors.phoneNO}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block font-bold mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`
                  w-full 
                  pl-3 
                  pr-10 
                  py-3 
                  rounded-lg 
                  border 
                  focus:outline-none 
                  focus:ring-2 
                  transition-all 
                  duration-300
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                      : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                  }
                 ${errors.email ? "border-red-500" : ""}`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>
            {isNew && (
              <p className="m-2">
                <a
                  className={`${
                    isDarkMode ? " text-white " : " text-gray-800 "
                  }  m-0 p-0 `}
                  href="login"
                >
                  لدي حساب بالفعل
                </a>
              </p>
            )}
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-4">
              <label htmlFor="governorate" className="block font-bold mb-2">
                المحافظة
              </label>
              <select
                id="governorate"
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
                className={`
                  w-full 
                  pl-3 
                  pr-10 
                  py-3 
                  rounded-lg 
                  border 
                  focus:outline-none 
                  focus:ring-2 
                  transition-all 
                  duration-300
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                      : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                  } ${errors.governorate ? "border-red-500" : ""}`}
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
                <option value="الحسكة">الحسكة</option>
                <option value="دير الزور">دير الزور</option>
                <option value="ادلب">ادلب</option>
              </select>

              {errors.governorate && (
                <p className="text-red-500 text-sm">{errors.governorate}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block font-bold mb-2">
                العنوان
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`
                  w-full 
                  pl-3 
                  pr-10 
                  py-3 
                  rounded-lg 
                  border 
                  focus:outline-none 
                  focus:ring-2 
                  transition-all 
                  duration-300
                  ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                      : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                  } ${errors.fullName ? "border-red-500" : ""}`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
            {isTechnical && (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="specialization"
                    className="block font-bold mb-2"
                  >
                    الاختصاص
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={`
                      w-full 
                      pl-3 
                      pr-10 
                      py-3 
                      rounded-lg 
                      border 
                      focus:outline-none 
                      focus:ring-2 
                      transition-all 
                      duration-300
                      ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                          : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                      } ${errors.specialization ? "border-red-500" : ""}`}
                    required
                  >
                    <option value="">اختر الاختصاص</option>
                    {specializations.map((specialization, index) => (
                      <option key={index} value={specialization}>
                        {specialization}
                      </option>
                    ))}
                  </select>

                  {errors.specialization && (
                    <p className="text-red-500 text-sm">
                      {errors.specialization}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="services" className="block font-bold mb-2">
                    وصف الخدمة
                  </label>
                  <textarea
                    id="services"
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    className={`
                      w-full 
                      pl-3 
                      pr-10 
                      py-3 
                      rounded-lg 
                      border 
                      focus:outline-none 
                      focus:ring-2 
                      transition-all 
                      duration-300
                      ${
                        isDarkMode
                          ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                          : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                      } ${errors.services ? "border-red-500" : ""}`}
                    required
                  />
                  {errors.services && (
                    <p className="text-red-500 text-sm">{errors.services}</p>
                  )}
                </div>
              </>
            )}
          </>
        );
      case 3:
        return (
          <>
            {isNew && (
              <>
                <div className="mb-4">
                  <label htmlFor="password" className="block font-bold mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={
                        isNew ? (formData as UserFormInput).password || "" : ""
                      }
                      onChange={handleChange}
                      className={`
                        w-full 
                        pl-3 
                        pr-10 
                        py-3 
                        rounded-lg 
                        border 
                        focus:outline-none 
                        focus:ring-2 
                        transition-all 
                        duration-300
                        ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                            : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                        } ${errors.password ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="confirmPassword"
                    className="block font-bold mb-2"
                  >
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordR ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={
                        isNew
                          ? (formData as UserFormInput).confirmPassword || ""
                          : ""
                      }
                      onChange={handleChange}
                      className={`
                        w-full 
                        pl-3 
                        pr-10 
                        py-3 
                        rounded-lg 
                        border 
                        focus:outline-none 
                        focus:ring-2 
                        transition-all 
                        duration-300
                        ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600"
                            : "bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300"
                        } ${errors.confirmPassword ? "border-red-500" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordR(!showPasswordR)}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswordR ? (
                        <EyeIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </>
            )}

            {isNew && (
              <div className="flex items-center w-full mt-4">
                <input
                  type="checkbox"
                  className="ml-2"
                  id="x"
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="x">
                  اوافق علي سياسة الخصوصية و
                  <a
                    href="/privacy-and-terms"
                    className={`${
                      isDarkMode ? " text-white " : " text-gray-800 "
                    }  m-0 p-0 border-b-2 `}
                  >
                    شروط الاستخدام
                  </a>
                </label>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className={`
      min-h-screen 
      flex 
      items-center 
      justify-center 
      p-4 
      relative 
      overflow-hidden
      ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-100 to-white"
      }
    `}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          <div
            className={`
          absolute 
          rounded-full 
          opacity-20 
          ${isDarkMode ? "bg-blue-500" : "bg-blue-200"}
        `}
            style={{
              width: "400px",
              height: "400px",
              top: "-100px",
              left: "-100px",
              filter: "blur(100px)",
            }}
          />
          <div
            className={`
          absolute 
          rounded-full 
          opacity-20 
          ${isDarkMode ? "bg-purple-500" : "bg-purple-200"}
        `}
            style={{
              width: "300px",
              height: "300px",
              bottom: "-100px",
              right: "-100px",
              filter: "blur(100px)",
            }}
          />
        </div>

        <div
          className={`
        w-full 
        max-w-md 
        p-8 
        rounded-xl 
        shadow-2xl 
        relative 
        z-10 
        transform 
        transition-all 
        duration-300 
        hover:scale-105
        ${
          isDarkMode
            ? "bg-gray-800 text-gray-100 border border-gray-700"
            : "bg-white text-gray-800 border border-gray-200"
        }
      `}
        >
         
          <motion.form
            onSubmit={handleFormSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
         
          >
             <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isDarkMode ? (
                <span className="text-blue-400">مرحبًا</span>
              ) : (
                <span className="text-blue-600">مرحبًا</span>
              )}
            </h2>
            <p className="text-gray-500">سجل بياناتك وانضم الى منصتنا</p>
          </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "tween" }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between items-center mt-6 space-x-4">
              {currentStep > 0 && (
                <motion.button
                  type="button"
                  onClick={handlePrev}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center
              ${
                isDarkMode
                  ? "bg-gray-600 text-white hover:bg-gray-500"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }
            `}
                >
                  <ArrowRightIcon className="ml-2" />
                  السابق
                </motion.button>
              )}

              {currentStep < 3 ? (
                <motion.button
                  type="button"
                  onClick={handleNext}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center
              ${
                isDarkMode
                  ? "bg-blue-700 text-white hover:bg-blue-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }
            `}
                >
                  التالي
                  <ArrowLeftIcon className="mr-2" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={
                    (isNew && (isLoading || !isChecked)) ||
                    (!isNew && isLoading)
                  }
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={`
              w-full py-3 rounded-lg transition-all duration-300 flex justify-center items-center
              ${
                isDarkMode
                  ? "bg-green-700 text-white"
                  : "bg-green-500 text-white"
              }
              ${
                (isLoading && isNew) || (!isChecked && isNew)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }
            `}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoaderIcon className="mr-2 animate-spin" />
                      جاري المعالجة...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CheckCircleIcon className="mr-2" />
                      {submitButtonLabel}
                    </div>
                  )}
                </motion.button>
              )}
            </div>
          </motion.form>
        </div>
      </div>
    </>
  );
};

export default UserForm;
