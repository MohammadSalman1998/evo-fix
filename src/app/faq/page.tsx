// src\app\faq\page.tsx
"use client"
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
// تعريف نوع الأسئلة الشائعة
interface FAQItem {
  id: number;
  question: string;
  answer: string | null;
}

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  // const [newQuestion, setNewQuestion] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  // جلب الأسئلة الشائعة عند التحميل
  const fetchFAQs = async () => {
    try {
      const response = await axios.get<{ faqs: FAQItem[] }>(
        `${API_BASE_URL}/fAQ`
      );
      setFaqs(response.data.faqs);
      console.log(response.data.faqs);
    } catch (error) {
      console.error("خطأ في جلب الأسئلة:", error);
      // toast.error("حدث خطأ أثناء جلب الأسئلة الشائعة.");
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);


  // توسيع أو طي السؤال
  const toggleExpand = (index: number) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
<section
  className={`
    w-full min-h-screen py-12 px-4 
    ${
      isDarkMode
        ? "bg-gray-900 text-gray-200"
        : "bg-gray-50 text-gray-900"
    }
    transition-colors duration-300
  `}
>
  <div 
    className={`
      mt-20 mx-auto p-6 rounded-xl shadow-lg 
      ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white"}
    `}
  >
    <h2 className="text-3xl font-extrabold mb-6 text-center pb-4 border-b border-gray-200 dark:border-gray-700">
      الأسئلة الشائعة
    </h2>

    {/* عرض الأسئلة الشائعة */}
    <div className="space-y-4">
      {faqs && faqs.length > 0 ? (
        faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`
              rounded-lg overflow-hidden transition-all duration-300 
              ${
                expandedIndex === index 
                  ? "border-2 border-blue-500" 
                  : "border border-gray-200 dark:border-gray-700"
              }
            `}
          >
            <button
              onClick={() => toggleExpand(index)}
              className={`
                w-full p-4 flex justify-between items-center text-right 
                transition-colors duration-300
                ${
                  expandedIndex === index
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <span className="font-semibold text-lg">{faq.question}</span>
              {expandedIndex === index ? (
                <FaChevronUp className="mr-2 text-blue-500" />
              ) : (
                <FaChevronDown className="mr-2 text-gray-500" />
              )}
            </button>
            
            {expandedIndex === index && (
              <div 
                className="
                  p-4 bg-gray-50 dark:bg-gray-800/50 
                  text-gray-700 dark:text-gray-300
                  border-t border-gray-200 dark:border-gray-700
                "
              >
                <p className="text-base">
                  {faq.answer || "لم تتم الإجابة بعد"}
                </p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-lg">لا توجد أسئلة متاحة حاليًا.</p>
        </div>
      )}
    </div>
  </div>
</section>
  );
};

export default FAQs;
