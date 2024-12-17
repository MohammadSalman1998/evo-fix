// src\app\users\[id]\page.tsx
"use client";

import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import UserForm from "@/components/forms/UserForm";
import { Modal, CircularProgress } from "@mui/material";
import Switch from "react-switch";
import { ThemeContext } from "@/app/context/ThemeContext";
import { CombinedUserFormInput } from "@/utils/types";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaArrowCircleRight, FaKey, FaTrash, FaUserEdit } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import { AuthContext } from "@/app/context/AuthContext";
import PasswordResetForm from "@/components/forms/PasswordResetForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ClipLoader } from "react-spinners";

interface TechnicianDetails {
  id: number;
  specialization: string;
  services: string;
}

interface SubAdminDetails {
  id: number;
  department: string;
  governorate: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNO: string;
  governorate: string;
  address: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  avatar: string | null;
  technician?: TechnicianDetails;
  subadmin?: SubAdminDetails;
}

const UserPage = () => {
  const { id } = useParams();
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [delleting, setDelleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const isNew = false;
  const router = useRouter();
  const [formData, setFormData] = useState<CombinedUserFormInput | null>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const userRole = localStorage.getItem("userRole");
  useEffect(() => {
    if (id) {
      const authToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || "";

      axios
        .get(`${API_BASE_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setUser(response.data);
          setFormData({
            fullName: response.data.fullName,
            email: response.data.email,
            phoneNO: response.data.phoneNO,
            governorate: response.data.governorate,
            address: response.data.address,
            specialization: response.data.technician?.specialization || "",
            services: response.data.technician?.services || "",
            department:
              response.data.role === "SUBADMIN"
                ? response.data.subadmin?.department || ""
                : undefined,
            admin_governorate:
              response.data.role === "SUBADMIN"
                ? response.data.subadmin?.governorate || ""
                : undefined,
            role: response.data.role,
            isActive: response.data.isActive,
            password: "",
            confirmPassword: "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          console.log("Request config:", error.config);
          console.log("Response data:", error.response?.data);
          setLoading(false);
          setEditing(false);
        });
    }
  }, [id]);

  const handelGoBack = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "ADMIN" || userRole === "SUBADMIN") {
      router.push("/admindashboard");
    } else if (userRole === "TECHNICAL") {
      router.push("/technicaldashboard");
    } else {
      router.push("/dashboard");
    }
  };

  const editUser = async (formData: CombinedUserFormInput) => {
    setEditing(true);
    const authToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || "";

    if (user) {
      try {
        const dataToSend = {
          fullName: formData.fullName,
          email: formData.email,
          phoneNO: formData.phoneNO,
          governorate: formData.governorate,
          address: formData.address,
          admin_governorate: formData.admin_governorate,
          specialization: formData.specialization,
          services: formData.services,
        };

        await axios.put(`${API_BASE_URL}/users/${user.id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        toast.success("تم تحديث بيانات المستخدم بنجاح!");
        setShowEditModal(false);

        // تحديث بيانات المستخدم مباشرة بدون إعادة تحميل
        setUser((prev) => ({
          ...prev!,
          ...formData,
        }));
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث بيانات المستخدم.");
        console.error("Error updating user data:", error);
      } finally {
        setEditing(false);
        setLoading(false);
      }
    }
  };
  //تعديل كلمة المرور
  const handleEditPassword = async (newPassword: string) => {
    setEditing(true);
    const authToken =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1] || "";

    if (user) {
      try {
        const dataToSend = {
          password: newPassword, // إرسال كلمة المرور الجديدة
        };

        await axios.put(`${API_BASE_URL}/users/${user.id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        toast.success("تم تحديث كلمة المرور بنجاح!");
        setShowEditModal(false);
        setEditPassword(false);

        // يمكن إضافة تحديث للحالة أو إجراء آخر بعد تحديث كلمة المرور إذا لزم الأمر
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث كلمة المرور.");
        console.error("Error updating password:", error);
      } finally {
        setEditing(false);
        setLoading(false);
      }
    }
  };

  //************* */
  const toggleActiveStatus = async () => {
    if (user) {
      setEditing(true);
      const authToken =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] || "";

      try {
        const updatedUser = { isActive: !user.isActive };
        await axios.put(`${API_BASE_URL}/users/${user.id}`, updatedUser, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        // تحديث حالة التفعيل مباشرة بدون إعادة تحميل
        setUser((prev) => ({ ...prev!, isActive: !prev!.isActive }));
        toast.success("تم تحديث حالة التفعيل بنجاح!");
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث حالة التفعيل.");
        console.error("Error updating user activation status:", error);
      } finally {
        setEditing(false);
        setLoading(false);
      }
    }
  };

  // عرض السبينر أثناء التحميل
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) return <p>لم يتم العثور على المستخدم</p>;

  const handleEditClick = () => {
    setShowEditModal(true);
  };
  const handleEditPass = () => {
    setEditPassword(true);
  };
  //*********************************************************************** */
  const handleDeleteAccount = () => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذا الحساب؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            setDelleting(true);
            const authToken =
              document.cookie
                .split("; ")
                .find((row) => row.startsWith("token="))
                ?.split("=")[1] || "";

            try {
              await axios.delete(`${API_BASE_URL}/users/${user.id}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });
              setDelleting(false);
              toast.success("تم حذف الحساب بنجاح!");
              logout();
              router.push("/");
            } catch (error) {
              toast.error("حدث خطأ أثناء محاولة حذف الحساب.");
              console.error("Error deleting user account:", error);
            }
          },
        },
        {
          label: "لا",
          onClick: () => {},
        },
      ],
    });
  };

  return (
<>
  {/* <Navbar /> */}
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

  <div
    className={`pt-20 mt-10 w-full p-6 shadow-lg rounded-xl transition-all duration-300 ease-in-out ${
      isDarkMode
        ? "bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 text-white"
        : "bg-gradient-to-b from-white via-gray-100 to-gray-50 text-gray-900"
    }`}
    style={{ minHeight: "100vh" }}
  >
    <button
      onClick={handelGoBack}
      className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-transform transform hover:scale-110"
    >
      <FaArrowCircleRight className="text-4xl" />
    </button>
    <h1 className="text-5xl font-extrabold mb-8 border-b-4 border-blue-500 pb-4 text-center">
      معلومات المستخدم
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[
        { label: "الاسم", value: user.fullName },
        { label: "البريد الإلكتروني", value: user.email },
        { label: "رقم الهاتف", value: user.phoneNO },
        { label: "المحافظة", value: user.governorate },
        { label: "العنوان", value: user.address },
        {
          label: "الدور",
          value:
            user.role === "TECHNICAL"
              ? "فني"
              : user.role === "SUBADMIN"
              ? "مسؤول فرعي"
              : user.role === "ADMIN"
              ? "مسؤول"
              : "مستخدم",
        },
      ].map((item, index) => (
        <p
          key={index}
          className="border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6 text-lg hover:shadow-xl transition-shadow duration-300"
        >
          <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">{item.label}:</strong>
          <span className="block text-lg overflow-auto font-medium">{item.value}</span>
        </p>
      ))}

      <div className="relative border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-green-50 via-white to-green-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
        <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">الحالة:</strong>
        <span
          className={`absolute top-7 right-1/4 w-4 h-4 rounded-full shadow-md ${
            user.isActive ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
        {(userRole === "ADMIN" || userRole === "SUBADMIN") && (
          <div className="mt-4">
            <Switch
              checked={user.isActive}
              onChange={toggleActiveStatus}
              onColor="#4A90E2"
              offColor="#FF6347"
              height={20}
              width={48}
              className="mr-4"
            />
            {editing && <CircularProgress size={20} className="inline ml-4" />}
          </div>
        )}
      </div>

      <div className="relative border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
        <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">التحقق:</strong>
        <span
          className={`absolute top-7 right-1/4 w-4 h-4 rounded-full shadow-md ${
            user.isVerified ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
      </div>

      <p className="border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-yellow-50 via-white to-yellow-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
        <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">تاريخ الإنشاء:</strong>
        <span className="block text-lg font-medium">{new Date(user.createdAt).toLocaleDateString("ar-EG")}</span>
      </p>

      {user.role === "TECHNICAL" && user.technician && (
        <>
          <p className="border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
            <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">التخصص:</strong>
            <span className="block text-lg font-medium">{user.technician.specialization}</span>
          </p>
          <p className="border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
            <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">الخدمات:</strong>
            <span className="block text-lg font-medium">{user.technician.services}</span>
          </p>
        </>
      )}

      {user.role === "SUBADMIN" && user.subadmin && (
        <>
          <p className="border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
            <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">القسم:</strong>
            <span className="block text-lg font-medium">{user.subadmin.department}</span>
          </p>
          <p className="border border-gray-300 dark:border-gray-600 bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-800 dark:to-gray-900 shadow-lg rounded-xl p-6">
            <strong className="block mb-2 text-blue-600 dark:text-blue-400 text-xl">القطاع:</strong>
            <span className="block text-lg font-medium">{user.subadmin.governorate}</span>
          </p>
        </>
      )}

      <div className="shadow-lg rounded-xl p-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6 bg-gradient-to-r from-gray-100 via-white to-gray-100 dark:from-gray-700 dark:to-gray-800">
        <button
          onClick={handleEditClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          <FaUserEdit /> تعديل الملف الشخصي
        </button>

        <button
          onClick={handleEditPass}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 hover:scale-105"
        >
          <FaKey /> تعديل كلمة المرور
        </button>

        {!(userRole === "ADMIN" || userRole === "SUBADMIN") && (
          <button
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 hover:scale-105"
          >
            {delleting ? <ClipLoader /> : <FaTrash />}
            {delleting ? "جارٍ الحذف ..." : "حذف الحساب"}
          </button>
        )}
      </div>
    </div>


    {showEditModal && (
  <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full mx-4">
        {/* زر الإغلاق */}
        <button
          onClick={() => setShowEditModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl transition duration-300"
          aria-label="إغلاق"
        >
          &times;
        </button>

        {/* محتوى المودال */}
        {formData && (
          <UserForm
            initialData={formData}
            onSubmit={editUser}
            isNew={isNew}
            isTechnical={user.role === "TECHNICAL"}
            isSubAdmin={user.role === "SUBADMIN"}
            onClose={() => setShowEditModal(false)}
            submitButtonLabel={isNew ? "إضافة" : "تعديل"}
          />
        )}
      </div>
    </div>
  </Modal>
)}

{editPassword && (
  <Modal open={editPassword} onClose={() => setEditPassword(false)}>
    <div className="relative flex items-center justify-center min-h-screen">
      <div className="relative p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* زر الإغلاق */}
        <button
          onClick={() => setEditPassword(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl transition duration-300"
          aria-label="إغلاق"
        >
          &times;
        </button>

        {/* محتوى المودال */}
        <PasswordResetForm
          onSubmit={handleEditPassword}
          password={password}
          confirmPassword={confirmPassword}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          darkMode={isDarkMode}
          loading={editing}
        />
      </div>
    </div>
  </Modal>
)}




{/* 
    {showEditModal && (
      <Modal className="" open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="relative p-8 bg-gradient-to-b  rounded-xl shadow-2xl max-w-lg mx-auto">

          <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-500 text-2xl hover:text-red-500 transition duration-300"
            >
              &times;
            </button>
          {formData && (
            <UserForm
              initialData={formData}
              onSubmit={editUser}
              isNew={isNew}
              isTechnical={user.role === "TECHNICAL"}
              isSubAdmin={user.role === "SUBADMIN"}
              onClose={() => setShowEditModal(false)}
              submitButtonLabel={isNew ? "إضافة" : "تعديل"}
            />
          )}
        </div>
      </Modal>
    )}

    {editPassword && (
      <Modal open={editPassword} onClose={() => setEditPassword(false)}>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="relative bg-gradient-to-b p-8 rounded-xl shadow-2xl">
            <button
              onClick={() => setEditPassword(false)}
              className="absolute top-0 right-4 text-gray-300 bg-gray-700 rounded-full p-2 hover:bg-gray-600"
            >
              ×
            </button>
            <PasswordResetForm
              onSubmit={handleEditPassword}
              password={password}
              confirmPassword={confirmPassword}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              darkMode={isDarkMode}
              loading={editing}
            />
          </div>
        </div>
      </Modal>
    )} */}
  </div>
</>


  );
};

export default UserPage;
