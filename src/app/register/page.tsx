// src\app\register\page.tsx
"use client";

import React, { useContext } from "react";
// import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
// import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import UserForm from "../../components/forms/UserForm";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import { RegisterUserData } from "../../utils/types"; // استيراد الواجهة المشتركة
import { AxiosError } from "axios";
const RegisterPage = () => {
  // const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async (data: RegisterUserData): Promise<void> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users`,
        {
          email: data.email,
          fullName: data.fullName,
          governorate: data.governorate,
          password: data.password,
          phoneNO: data.phoneNO,
          address: data.address,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const userId = response.data.id;
        const email = response.data.email;
        const userRole = response.data.role;
        const token = response.data.token;

        // حفظ التوكن في الكوكيز
        Cookies.set("token", token, {
          expires: 30,
          secure: process.env.NODE_ENV === "production",
        });

        // حفظ المعرف والبريد الإلكتروني في localStorage
        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", userRole);

        toast.success("تم إنشاء الحساب بنجاح!");
        toast.success(
          "تم ارسال بريد تحقق الى بريدك الالكتروني الرجاء تاكيد حسابك",
          {
            duration: 10000,
          }
        );

        // تسجيل الدخول تلقائيًا
        login(email, userId);

        // إعادة توجيه المستخدم بعد التسجيل
        setTimeout(() => {
          if (userRole === "ADMIN" || userRole === "SUBADMIN") {
            router.push("/admindashboard");
          } else if (userRole === "TECHNICAL") {
            router.push("/technicaldashboard");
          } else {
            router.push("/dashboard");
          }
        }, 5000);
      } else {
        toast.error("حدث خطأ أثناء إنشاء الحساب.");
      }
    } catch (error) {
      // التحقق إذا كان الخطأ من نوع AxiosError
      if (error instanceof AxiosError && error.response) {
        // عرض رسالة الخطأ من الخادم في التوست
        const message = error.response.data.message || "حدث خطأ غير معروف";
        toast.error(message);
      } else {
        toast.error("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقاً.");
      }
    }
  };

  return (
    <>
      <Toaster />
        <UserForm onSubmit={handleRegister} isNew={true} isUser={true} />
    </>
  );
};

export default RegisterPage;
