// src\app\admindashboard\ContactUsAndFAQ.tsx
import React, { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { useRepairRequests } from "@/app/context/adminData";
import Switch from "react-switch";
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";
import axios from "axios";
import Cookies from "js-cookie";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ContactUsAndFAQ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"messages" | "faqs">("messages");
  const { faqs = [], fetchFAQs, isFAQsLoading } = useRepairRequests();
  const {
    contactMessages = [],
    fetchContactMessages,
    isContactMessagesLoading,
  } = useRepairRequests();
  const [localFaqs, setLocalFaqs] = useState(faqs);
  const [localContactMessages, setLocalContactMessages] =
    useState(contactMessages);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const { isDarkMode } = useContext(ThemeContext);
  const token = Cookies.get("token");

  useEffect(() => {
    fetchFAQs();
    fetchContactMessages();
  }, []);

  useEffect(() => {
    setLocalFaqs(faqs);
  }, [faqs]);

  useEffect(() => {
    setLocalContactMessages(contactMessages);
  }, [contactMessages]);

  const handleTogglePublish = async (faqId: number, isPublished: boolean) => {
    try {
      await axios.put(
        `${API_BASE_URL}/fAQ/${faqId}`,
        { isPublished: !isPublished },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedFaqs = localFaqs.map((faq) =>
        faq.id === faqId ? { ...faq, isPublished: !isPublished } : faq
      );
      setLocalFaqs(updatedFaqs);
      toast.success("تم تحديث حالة النشر بنجاح.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء تحديث حالة النشر.");
    }
  };

  const handleAddAnswer = async (faqId: number) => {
    try {
      await axios.put(
        `${API_BASE_URL}/fAQ/${faqId}`,
        { answer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedFaqs = localFaqs.map((faq) =>
        faq.id === faqId ? { ...faq, answer } : faq
      );
      setLocalFaqs(updatedFaqs);
      setAnswer("");
      setSelectedFaq(null);
      toast.success("تم إضافة الإجابة بنجاح.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء إضافة الإجابة.");
    }
  };

  const handleDelete = (id: number, type: "contact" | "faq") => {
    confirmAlert({
      title: "تأكيد الحذف",
      message: "هل أنت متأكد أنك تريد حذف هذا العنصر؟",
      buttons: [
        {
          label: "نعم",
          onClick: async () => {
            try {
              await axios.delete(
                `${API_BASE_URL}/${
                  type === "contact" ? "contact-us" : "fAQ"
                }/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              if (type === "faq") {
                setLocalFaqs(localFaqs.filter((faq) => faq.id !== id));
              } else {
                setLocalContactMessages(
                  localContactMessages.filter((message) => message.id !== id)
                );
              }
              toast.success("تم حذف العنصر بنجاح.");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
              toast.error("حدث خطأ أثناء الحذف.");
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
    <div className={`container mx-auto px-4 py-6 ${
      isDarkMode 
        ? "bg-gray-800 text-gray-100" 
        : "bg-white text-gray-900"
    }`}>
      <div className={`rounded-xl shadow-lg overflow-hidden ${
        isDarkMode 
          ? "bg-gray-900 border-gray-700" 
          : "bg-gray-50 border-gray-200"
      } border`}>
        <div className="px-6 py-4 bg-blue-500 text-white flex justify-between items-center">
          <h2 className="text-2xl font-bold">اتصل بنا والأسئلة الشائعة</h2>
        </div>

        {/* التبويبات */}
        <div className="flex border-b px-4 py-2">
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-3 text-center transition-all duration-300 ${
              activeTab === "messages"
                ? "bg-blue-500 text-white rounded-t-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            الرسائل
          </button>
          <button
            onClick={() => setActiveTab("faqs")}
            className={`flex-1 py-3 text-center transition-all duration-300 ${
              activeTab === "faqs"
                ? "bg-blue-500 text-white rounded-t-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            الأسئلة الشائعة
          </button>
        </div>

        {/* محتوى الرسائل */}
        {activeTab === "messages" && (
          <div className="p-4">
            {isContactMessagesLoading ? (
              <div className="text-center text-gray-500">جارٍ التحميل...</div>
            ) : localContactMessages.length === 0 ? (
              <div className="text-center text-gray-500">لا توجد رسائل</div>
            ) : (
              <ul className="space-y-4 overflow-auto">
                {localContactMessages.map((message) => (
                  <li 
                    key={message.id} 
                    className={`p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600" 
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">{message.subject}</h3>
                      <button 
                        onClick={() => handleDelete(message.id, "contact")}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <p className="text-sm mb-2">{message.content}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{message.email}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.sentAt).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* محتوى الأسئلة الشائعة */}
        {activeTab === "faqs" && (
          <div className="p-4">
            {isFAQsLoading ? (
              <div className="text-center text-gray-500">جارٍ التحميل...</div>
            ) : localFaqs.length === 0 ? (
              <div className="text-center text-gray-500">لا توجد أسئلة شائعة</div>
            ) : (
              <ul className="space-y-4">
                {localFaqs.map((faq) => (
                  <li 
                    key={faq.id} 
                    className={`p-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600" 
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg">{faq.question}</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDelete(faq.id, "faq")}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                        <Switch
                          checked={faq.isPublished}
                          onChange={() => handleTogglePublish(faq.id, faq.isPublished)}
                          onColor="#4A90E2"
                          offColor="#FF6347"
                          height={20}
                          width={40}
                        />
                      </div>
                    </div>

                    {faq.answer && (
                      <p className="text-sm text-green-500 mb-2">{faq.answer}</p>
                    )}

                    {selectedFaq === faq.id ? (
                      <div className="mt-2 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="أدخل الإجابة"
                          className={`w-full p-2 border rounded ${
                            isDarkMode 
                              ? "bg-gray-800 text-white border-gray-600" 
                              : "bg-white text-black border-gray-300"
                          }`}
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAddAnswer(faq.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded flex items-center space-x-1 hover:bg-green-600"
                          >
                            <FaCheckCircle />
                            <span>إرسال</span>
                          </button>
                          <button
                            onClick={() => setSelectedFaq(null)}
                            className="px-4 py-2 bg-red-500 text-white rounded flex items-center space-x-1 hover:bg-red-600"
                          >
                            <FaTimesCircle />
                            <span>إلغاء</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedFaq(faq.id)}
                        className="mt-2 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <FaEdit />
                        <span>{faq.answer ? "تعديل الإجابة" : "إضافة إجابة"}</span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUsAndFAQ;