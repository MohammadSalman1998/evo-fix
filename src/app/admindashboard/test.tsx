// src\app\admindashboard\test.tsx
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

        // Update model locally
        setDeviceModels((prev) =>
          prev.map((model) => (model.id === selectedModel.id ? data : model))
        );
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

        // Add new model locally using server data
        setDeviceModels((prev) => [response.data.device_model, ...prev]);
      }

      setIsModalOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ غير متوقع، الرجاء المحاولة لاحقًا");
    }
  };

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

      // Remove model from local state
      setDeviceModels((prev) => prev.filter((model) => model.id !== id));
    } catch (error) {
      toast.error("حدث خطأ اثناء الحذف");
      console.error(error);
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








































// // src\app\admindashboard\users\AddUserForm.tsx
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "@/utils/api";
// import { ThemeContext } from "../../context/ThemeContext";

// interface AddUserFormProps {
//   onSubmit: (data: UserFormData) => Promise<void>;
//   onClose: () => void;
// }

// interface UserFormData {
//   fullName: string;
//   phoneNO: string;
//   email: string;
//   governorate: string;
//   address: string;
//   role: "USER" | "SUBADMIN" | "TECHNICAL" | "ADMIN";
//   specialization?: string;
//   services?: string;
//   admin_governorate?: string;
//   password: string;
// }

// interface Service {
//   title: string;
// }

// const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onClose }) => {
//   const [formData, setFormData] = useState<UserFormData>({
//     fullName: "",
//     phoneNO: "",
//     email: "",
//     governorate: "",
//     address: "",
//     role: "USER",
//     password: "",
//     admin_governorate: "",
//     specialization: "",
//     services: "",
//   });

//   const [specializations, setSpecializations] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const { isDarkMode } = useContext(ThemeContext);
//   const userRole = localStorage.getItem("userRole");

//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/services`)
//       .then((response) => {
//         if (response.data.services && Array.isArray(response.data.services)) {
//           const titles = response.data.services.map(
//             (service: Service) => service.title
//           );
//           setSpecializations(titles);
//         }
//       })
//       .catch((error) => console.error("فشل في جلب الخدمات:", error));
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "", // Clear error for the field being changed
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.fullName) {
//       newErrors.fullName = "يجب إدخال الاسم الكامل.";
//     }

//     if (!formData.phoneNO) {
//       newErrors.phoneNO = "رقم الهاتف مطلوب.";
//     } else if (!/^\d{10}$/.test(formData.phoneNO)) {
//       newErrors.phoneNO = "ادخل رقم هاتف صالح";
//     }

//     if (!formData.email) {
//       newErrors.email = "البريد الإلكتروني مطلوب.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "البريد الإلكتروني غير صالح.";
//     }
//     if (!formData.address) {
//       newErrors.address = "العنوان مطلوب.";
//     } else if (formData.address.length < 10) {
//       newErrors.address = "يجب أن يكون العنوان أكثر من 10 أحرف.";
//     }

//     if (!formData.password) {
//       newErrors.password = "كلمة المرور مطلوبة.";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "يجب أن تكون كلمة المرور أكثر من 8 أحرف.";
//     }

//     if (formData.role === "TECHNICAL") {
//       if (!formData.specialization) {
//         newErrors.specialization = "يجب اختيار الاختصاص.";
//       }

//       if (!formData.services) {
//         newErrors.services = "يجب إدخال الخدمات.";
//       }
//     }
//     if (formData.role === "SUBADMIN") {
//       if (!formData.admin_governorate) {
//         newErrors.admin_governorate = "حدد قطاع العمل";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if there are no errors
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return; // Stop submission if validation fails
//     }

//     setLoading(true);
//     try {
//       await onSubmit(formData);
//       toast.success("تم إضافة المستخدم بنجاح!");
//       onClose();
//     } catch (error) {
//       console.error("خطأ أثناء إضافة المستخدم:", error);
//       toast.error("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`overflow-y-auto max-h-screen custom-sidebar-scroll p-2${
//         isDarkMode ? "bg-gray-800" : "bg-gray-200"
//       }`}
//     >
//       <form
//         onSubmit={handleSubmit}
//         className={`p-4 rounded-lg shadow-md flex flex-col gap-y-2 md:grid md:grid-cols-2 gap-x-4 ${
//           isDarkMode ? "text-light" : "text-black"
//         }`}
//       >
//         <div className="mb-2">
//           <label className="block">الاسم الكامل:</label>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.fullName && (
//             <span className="text-red-600">{errors.fullName}</span>
//           )}
//         </div>

//         <div className="mb-2">
//           <label className="block">رقم الهاتف:</label>
//           <input
//             type="text"
//             name="phoneNO"
//             value={formData.phoneNO}
//             onChange={handleChange}
//             required
//             className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.phoneNO && (
//             <span className="text-red-600">{errors.phoneNO}</span>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block">البريد الإلكتروني:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.email && <span className="text-red-600">{errors.email}</span>}
//         </div>

//         <div className="mb-4">
//           <label className="block">المحافظة:</label>
//           <select
//             name="governorate"
//             value={formData.governorate}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">اختر المحافظة</option>
//             <option value="دمشق">دمشق</option>
//             <option value="ريف دمشق">ريف دمشق</option>
//             <option value="حمص">حمص</option>
//             <option value="حماه">حماه</option>
//             <option value="طرطوس">طرطوس</option>
//             <option value="اللاذقية">اللاذقية</option>
//             <option value="السويداء">السويداء</option>
//             <option value="القنيطرة">القنيطرة</option>
//             <option value="حلب">حلب</option>
//             <option value="الرقة">الرقة</option>
//             <option value="الحسكة">الحسكة</option>
//             <option value="دير الزور">دير الزور</option>
//             <option value="ادلب">ادلب</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block">العنوان:</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.address && (
//             <span className="text-red-600">{errors.address}</span>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block">نوع المستخدم:</label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//             className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="USER">مستخدم</option>
//             <option value="TECHNICAL">تقني</option>
//             {userRole === "ADMIN" && <option value="ADMIN">مدير</option>}
//             {userRole === "ADMIN" && (
//               <option value="SUBADMIN">مدير محافظة</option>
//             )}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block">كلمة المرور:</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.password && (
//             <span className="text-red-600">{errors.password}</span>
//           )}
//         </div>

//         {formData.role === "TECHNICAL" && (
//           <>
//             <div className="mb-4">
//               <label className="block">الاختصاص:</label>
//               <select
//                 name="specialization"
//                 onChange={handleChange}
//                 className={`
//                     w-full pl-10 pr-3 py-2 rounded-lg
//                     ${isDarkMode 
//                       ? 'bg-gray-700 text-white border-gray-600' 
//                       : 'bg-white text-gray-900 border-gray-300'}
//                     border focus:outline-none focus:ring-2 focus:ring-blue-500
//                     transition duration-300
//                   `}              >
//                 <option value="">اختر الاختصاص</option>
//                 {specializations.map((spec) => (
//                   <option key={spec} value={spec}>
//                     {spec}
//                   </option>
//                 ))}
//               </select>
//               {errors.specialization && (
//                 <span className="text-red-600">{errors.specialization}</span>
//               )}
//             </div>

//             <div className="mb-4">
//               <label className="block">الخدمات:</label>
//               <input
//                 type="text"
//                 name="services"
//                 value={formData.services}
//                 onChange={handleChange}
//                 className={`
//                     w-full pl-10 pr-3 py-2 rounded-lg
//                     ${isDarkMode 
//                       ? 'bg-gray-700 text-white border-gray-600' 
//                       : 'bg-white text-gray-900 border-gray-300'}
//                     border focus:outline-none focus:ring-2 focus:ring-blue-500
//                     transition duration-300
//                   `}              />
//               {errors.services && (
//                 <span className="text-red-600">{errors.services}</span>
//               )}
//             </div>
//           </>
//         )}
//         {formData.role === "SUBADMIN" && (
//           <>
//             <div className="mb-4">
//               <label className="block">قطاع العمل:</label>
//               <select
//                 name="admin_governorate"
//                 value={formData.admin_governorate}
//                 onChange={handleChange}
//                 required
//                 className={`
//                     w-full pl-10 pr-3 py-2 rounded-lg
//                     ${isDarkMode 
//                       ? 'bg-gray-700 text-white border-gray-600' 
//                       : 'bg-white text-gray-900 border-gray-300'}
//                     border focus:outline-none focus:ring-2 focus:ring-blue-500
//                     transition duration-300
//                   `}              >
//                 <option value="">اختر المحافظة</option>
//                 <option value="دمشق">دمشق</option>
//                 <option value="ريف دمشق">ريف دمشق</option>
//                 <option value="حمص">حمص</option>
//                 <option value="حماه">حماه</option>
//                 <option value="طرطوس">طرطوس</option>
//                 <option value="اللاذقية">اللاذقية</option>
//                 <option value="السويداء">السويداء</option>
//                 <option value="القنيطرة">القنيطرة</option>
//                 <option value="حلب">حلب</option>
//                 <option value="الرقة">الرقة</option>
//                 <option value="الحسكة">الحسكة</option>
//                 <option value="دير الزور">دير الزور</option>
//                 <option value="ادلب">ادلب</option>
//               </select>
//             </div>
//           </>
//         )}

//         <button
//           type="submit"
//           className={`mt-4 p-2 rounded-lg ${
//             isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
//           } hover:bg-blue-700`}
//           disabled={loading}
//         >
//           {loading ? "جارٍ الإضافة..." : "إضافة مستخدم"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddUserForm;









