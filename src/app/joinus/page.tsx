// src\app\joinus\page.tsx
"use client";

import React, { useContext } from "react";
// import Navbar from "@/components/navBar";
import toast, { Toaster } from "react-hot-toast";
// import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import UserForm from "../../components/forms/UserForm";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import { RegisterTechnicianData } from "../../utils/types";

const RegisterTechnicianPage = () => {
  // const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegisterTechnician = async (
    data: RegisterTechnicianData
  ): Promise<void> => {
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
          specialization: data.specialization,
          services: data.services,
          role: "TECHNICAL",
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

        Cookies.set("token", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
        });

        localStorage.setItem("userId", userId.toString());
        localStorage.setItem("email", email);
        localStorage.setItem("userRole", userRole);

        toast.success("تم إنشاء حساب تقني بنجاح!");
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
        toast.error("حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "حدث خطأ غير معروف";
        toast.error(`خطأ: ${errorMessage}`);
      } else {
        toast.error("تعذر الاتصال بالخادم");
      }
    }
  };

  return (
    <>
      <Toaster />
          <UserForm
            onSubmit={handleRegisterTechnician}
            isNew={true}
            isUser={false}
            isTechnical={true}
          />
    </>
  );
};

export default RegisterTechnicianPage;
