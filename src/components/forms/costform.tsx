// src\components\forms\costform.tsx
import React, { useContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
import { X, Check, DollarSign, FileText } from "lucide-react";

interface PricingFormProps {
  requestId: string;
  onClose: () => void;
  onRequestUpdated: () => void;
}

const PricingForm: React.FC<PricingFormProps> = ({
  requestId,
  onClose,
  onRequestUpdated,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [cost, setCost] = useState<number | "">("");
  const [resultCheck, setResultCheck] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من أن التكلفة رقم صحيح وأن وصف العطل ليس فارغًا
    if (cost === "" || Number(cost) < 0 || resultCheck.trim() === "") {
      setError("يجب إدخال تكلفة صالحة ووصف العطل");
      return;
    }

    try {
      setIsLoading(true);
      const token = Cookies.get("token");
      await axios.put(
        `${API_BASE_URL}/maintenance-requests/${requestId}/quote`,
        {
          cost: Number(cost), // التأكد من إرسال التكلفة كـ number
          resultCheck,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onRequestUpdated();
      onClose();
    } catch (err) {
      console.error("خطأ أثناء تسعير الطلب:", err);
      setError("حدث خطأ أثناء تسعير الطلب.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto ${
        isDarkMode 
          ? "bg-gray-900/50 backdrop-blur-sm" 
          : "bg-gray-500/30 backdrop-blur-sm"
      }`}
    >
      <div 
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isDarkMode 
            ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white" 
            : "bg-gradient-to-br from-white to-gray-50 text-gray-800"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 bg-red-500/20 hover:bg-red-500/40 rounded-full p-2 transition-all duration-300"
        >
          <X size={24} className="text-red-500" />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
            <DollarSign className="mr-2 text-blue-500" size={28} />
            تسعير الطلب
          </h2>

          <form onSubmit={handleSave}>
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="cost" 
                  className="block text-sm font-medium mb-2 flex items-center"
                >
                  <DollarSign className="mr-2 text-blue-500" size={18} />
                  التكلفة
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="cost"
                    value={cost}
                    onChange={(e) => {
                      setCost(e.target.value === "" ? "" : Number(e.target.value));
                      setError("");
                    }}
                    className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                        : "bg-white border-gray-300 text-black focus:border-blue-500 focus:ring-blue-500"
                    } ${error && cost === "" ? "border-red-500" : ""}`}
                    placeholder="أدخل التكلفة"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="resultCheck" 
                  className="block text-sm font-medium mb-2 flex items-center"
                >
                  <FileText className="mr-2 text-green-500" size={18} />
                  وصف العطل
                </label>
                <textarea
                  id="resultCheck"
                  value={resultCheck}
                  onChange={(e) => {
                    setResultCheck(e.target.value);
                    setError("");
                  }}
                  className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 text-sm min-h-[100px] ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                      : "bg-white border-gray-300 text-black focus:border-blue-500 focus:ring-blue-500"
                  } ${error && resultCheck.trim() === "" ? "border-red-500" : ""}`}
                  placeholder="أدخل وصف العطل"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm flex items-center">
                  <span className="ml-2">⚠️</span>
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6 space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500/20 text-gray-700 dark:text-white py-3 rounded-lg hover:bg-gray-500/30 transition-all duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                إغلاق
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 rounded-lg text-white font-bold transition-all duration-300 flex items-center justify-center ${
                  isLoading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ClipLoader color="#fff" size={20} />
                ) : (
                  <>
                    <Check className="mr-2" size={20} />
                    إرسال
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PricingForm;