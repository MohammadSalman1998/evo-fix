// src\app\privacy-and-terms\page.tsx
"use client";
import React, { useContext, useEffect, useState } from "react";
import Navbar from "@/components/navBar";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { API_BASE_URL } from "@/utils/api";

// تعريف واجهة TermPolicy
interface TermPolicy {
  id: number;
  version: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function PrivacyAndTerms() {
  const { isDarkMode } = useContext(ThemeContext);
  const [termsPolicy, setTermsPolicy] = useState<TermPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the terms and policies data
    const fetchTermsAndPolicy = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/termsOfUsePolicy`);
        setTermsPolicy(response.data.TermsPolicy);
      } catch (error) {
        console.error("Error fetching terms and policies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTermsAndPolicy();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">جاري التحميل...</div>;
  }

  return (
    <>
    <Navbar />
    <div
      className={`mx-auto mt-20 px-6 py-12 text-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
      style={{ minHeight: "100vh", marginTop: "75px" }}
    >
      {/* العنوان الرئيسي */}
      <h1 className="text-4xl font-bold mb-8 text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-500">
        سياسة الخصوصية وشروط الاستخدام
      </h1>
  
      {/* عرض البنود */}
      <div className="text-right max-w-3xl mx-auto space-y-10">
        {termsPolicy.map((policy) =>
          policy.title ? (
            <section
              key={policy.id}
              className="transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:bg-gray-200 rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-600 hover:text-blue-800 transition duration-300">
                {policy.title}
              </h2>
              <p className="leading-relaxed text-lg text-gray-700">{policy.content}</p>
            </section>
          ) : null
        )}
      </div>
  
      {/* قسم اتصل بنا */}
      <section className="mt-12 p-6 bg-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">
          اتصل بنا
        </h2>
        <p className="text-lg text-gray-800">
          إذا كان لديك أي استفسارات حول سياسة الخصوصية أو شروط الاستخدام، لا
          تتردد في التواصل معنا من خلال قسم الدعم في الموقع.
        </p>
      </section>
  
      {/* زر العودة إلى الصفحة الرئيسية */}
      <div className="mt-8">
        <a
          href="/"
          className="text-blue-500 hover:text-blue-700 font-medium transition-all duration-300 transform hover:scale-105"
        >
          العودة إلى الصفحة الرئيسية
        </a>
      </div>
    </div>
  </>
  
  );
}
