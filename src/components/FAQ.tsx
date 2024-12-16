// src\components\FAQ.tsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/utils/api";

const FAQ = () => {

  const [newQuestion, setNewQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  // إرسال سؤال جديد
  const handleNewQuestionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!newQuestion) {
      toast.error("يرجى إدخال السؤال.");
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/fAQ`, {
        question: newQuestion, // إرسال السؤال فقط
      });
      toast.success("تم إرسال السؤال بنجاح!");

      // إعادة تعيين الحقول بعد الإرسال
      setNewQuestion("");
    } catch (error) {
      console.error("خطأ في إضافة السؤال:", error);
      toast.error("حدث خطأ أثناء إرسال السؤال.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
    {/* زر فتح نافذة إضافة سؤال */}
    <div className="text-center">
      <button
        onClick={() => setIsPopupOpen(true)}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md transition-all duration-300 
          hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
          dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        إرسال سؤال
      </button>
    </div>
  
    {/* نافذة منبثقة لإضافة سؤال جديد */}
    {isPopupOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-auto relative overflow-hidden">
          {/* زر الإغلاق */}
          <button
            onClick={() => setIsPopupOpen(false)}
            className="absolute top-4 left-4 text-gray-500 dark:text-gray-300 
              hover:text-gray-700 dark:hover:text-gray-100 transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          {/* محتوى النافذة المنبثقة */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              أضف سؤالك
            </h3>
            
            <form onSubmit={handleNewQuestionSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="أدخل السؤال هنا"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 
                    rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md 
                  transition-all duration-300 hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                  dark:bg-blue-500 dark:hover:bg-blue-600
                  disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "جاري الإرسال..." : "إرسال السؤال"}
              </button>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default FAQ;






