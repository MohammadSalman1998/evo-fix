// src\app\register\page.tsx
// "use client";

// import React, { useContext } from "react";
// // import Navbar from "@/components/navBar";
// import toast, { Toaster } from "react-hot-toast";
// // import { ThemeContext } from "../context/ThemeContext";
// import { AuthContext } from "../context/AuthContext";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import UserForm from "../../components/forms/UserForm";
// import Cookies from "js-cookie";
// import { API_BASE_URL } from "../../utils/api";
// import { RegisterUserData } from "../../utils/types"; // استيراد الواجهة المشتركة
// import { AxiosError } from "axios";
// const RegisterPage = () => {
//   // const { isDarkMode } = useContext(ThemeContext);
//   const { login } = useContext(AuthContext);
//   const router = useRouter();

//   const handleRegister = async (data: RegisterUserData): Promise<void> => {
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/users`,
//         {
//           email: data.email,
//           fullName: data.fullName,
//           governorate: data.governorate,
//           password: data.password,
//           phoneNO: data.phoneNO,
//           address: data.address,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       if (response.status === 200 || response.status === 201) {
//         const userId = response.data.id;
//         const email = response.data.email;
//         const userRole = response.data.role;
//         const token = response.data.token;

//         // حفظ التوكن في الكوكيز
//         Cookies.set("token", token, {
//           expires: 30,
//           secure: process.env.NODE_ENV === "production",
//         });

//         // حفظ المعرف والبريد الإلكتروني في localStorage
//         localStorage.setItem("userId", userId.toString());
//         localStorage.setItem("email", email);
//         localStorage.setItem("userRole", userRole);

//         toast.success("تم إنشاء الحساب بنجاح!");
//         toast.success(
//           "تم ارسال بريد تحقق الى بريدك الالكتروني الرجاء تاكيد حسابك",
//           {
//             duration: 10000,
//           }
//         );

//         // تسجيل الدخول تلقائيًا
//         login(email, userId);

//         // إعادة توجيه المستخدم بعد التسجيل
//         setTimeout(() => {
//           if (userRole === "ADMIN" || userRole === "SUBADMIN") {
//             router.push("/admindashboard");
//           } else if (userRole === "TECHNICAL") {
//             router.push("/technicaldashboard");
//           } else {
//             router.push("/dashboard");
//           }
//         }, 5000);
//       } else {
//         toast.error("حدث خطأ أثناء إنشاء الحساب.");
//       }
//     } catch (error) {
//       // التحقق إذا كان الخطأ من نوع AxiosError
//       if (error instanceof AxiosError && error.response) {
//         // عرض رسالة الخطأ من الخادم في التوست
//         const message = error.response.data.message || "حدث خطأ غير معروف";
//         toast.error(message);
//       } else {
//         toast.error("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقاً.");
//       }
//     }
//   };

//   return (
//     <>
//       <Toaster />
//         <UserForm onSubmit={handleRegister} isNew={true} isUser={true} />
//     </>
//   );
// };

// export default RegisterPage;

"use client";

import React, { useState, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import UserForm from "../../components/forms/UserForm";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import { RegisterUserData, RegisterTechnicianData } from "../../utils/types";
import { ThemeContext } from "../context/ThemeContext";
type AccountType = "USER" | "TECHNICAL";

const RegisterPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [selectedAccountType, setSelectedAccountType] =
    useState<AccountType | null>(null);
  const { isDarkMode } = useContext(ThemeContext);

  const handleRegister = async (
    data: RegisterUserData | RegisterTechnicianData
  ): Promise<void> => {
    try {
      const payload =
        selectedAccountType === "TECHNICAL"
          ? {
              ...data,
              role: "TECHNICAL",
              specialization: (data as RegisterTechnicianData).specialization,
              services: (data as RegisterTechnicianData).services,
            }
          : {
              ...data,
              role: "USER",
            };

      const response = await axios.post(`${API_BASE_URL}/users`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        const { id: userId, email, role: userRole, token } = response.data;

        Cookies.set("token", token, {
          expires: 30,
          secure: process.env.NODE_ENV === "production",
        });

        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", userRole);

        toast.success("تم إنشاء الحساب بنجاح!");
        toast.success(
          "تم إرسال بريد تحقق إلى بريدك الإلكتروني الرجاء تأكيد حسابك",
          { duration: 10000 }
        );

        login(email, userId);

        setTimeout(() => {
          switch (userRole) {
            case "ADMIN":
            case "SUBADMIN":
              router.push("/admindashboard");
              break;
            case "TECHNICAL":
              router.push("/technicaldashboard");
              break;
            default:
              router.push("/dashboard");
          }
        }, 5000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message || "حدث خطأ غير معروف";
        toast.error(message);
      } else {
        toast.error("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
      }
    }
  };

  // إذا لم يتم اختيار نوع الحساب بعد
  if (!selectedAccountType) {
    return (
      <div
        className={`
        min-h-screen flex items-center justify-center transition-colors duration-500 
        ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-blue-100 via-purple-200 to-pink-100"
        } p-4 relative`}
      >
        <div
          className={`
          w-full max-w-xl rounded-3xl shadow-2xl p-10 text-center transition-all duration-500
          ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-md text-white border border-gray-700"
              : "bg-white/90 backdrop-blur-md text-gray-800 border border-white/30"
          }
          transform hover:scale-105 hover:shadow-3xl`}
        >
          <h2
            className={`
            text-3xl font-bold mb-8 tracking-wider
            ${isDarkMode ? "text-white" : "text-gray-800"}
          `}
          >
            اختر نوع الحساب
          </h2>
          <p
            className={`
            mb-6 text-lg leading-relaxed
            ${isDarkMode ? "text-gray-300" : "text-gray-600"}
          `}
          >
            إذا كنت ترغب في إنشاء حساب لإجراء الصيانة، اختر{" "}
            <strong>حساب مستخدم</strong>.<br />
            إذا كنت ترغب في الانضمام إلينا كمحترف صيانة، اختر{" "}
            <strong>حساب تقني</strong>.
          </p>

          <div className="flex justify-center space-x-6">
            <button
              onClick={() => setSelectedAccountType("USER")}
              className={`
                px-8 py-4 rounded-xl shadow-lg transition-all 
                hover:shadow-xl transform hover:scale-110 
                focus:outline-none focus:ring-4
                ${
                  isDarkMode
                    ? "bg-blue-700 text-white hover:bg-blue-600 focus:ring-blue-500"
                    : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300"
                }
              `}
            >
              حساب مستخدم
            </button>
            <button
              onClick={() => setSelectedAccountType("TECHNICAL")}
              className={`
                px-8 py-4 rounded-xl shadow-lg transition-all 
                hover:shadow-xl transform hover:scale-110 
                focus:outline-none focus:ring-4
                ${
                  isDarkMode
                    ? "bg-green-700 text-white hover:bg-green-600 focus:ring-green-500"
                    : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300"
                }
              `}
            >
              حساب تقني
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />

      <div
        className={`
      min-h-screen 
      flex 
      items-center 
      w-full
      justify-center 
      relative 
      ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-100 to-white"
      }
    `}
      >
        <UserForm
          onSubmit={handleRegister}
          isNew={true}
          isUser={selectedAccountType === "USER"}
          isTechnical={selectedAccountType === "TECHNICAL"}
          submitButtonLabel="إنشاء حساب"
        />
      </div>
    </>
  );
};

export default RegisterPage;
