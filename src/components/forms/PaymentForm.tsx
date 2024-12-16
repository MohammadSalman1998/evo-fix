// src\components\forms\PaymentForm.tsx
import React, { useState, useContext } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";

import SyriatelImage from "../assets/images/syriatel.jpg";
import MTNImage from "../assets/images/mtn.png";
import { ClipLoader } from "react-spinners";
import { CreditCard, ArrowLeft, Check, X } from "lucide-react";

interface PaymentFormProps {
  requestId: number | null;
  closeModal: () => void;
  update: () => void;
  isInspectionPayment: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  requestId,
  closeModal,
  update,
  isInspectionPayment,
}) => {
  const [step, setStep] = useState(1);
  const [typePaid, setTypePaid] = useState<string | null>(null);
  const [OperationNumber, setOperationNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [CheckFee, setCheckFee] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isDarkMode } = useContext(ThemeContext);

  const handleTypeSelect = (type: string) => {
    setTypePaid(type);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    const finalAmount = isInspectionPayment ? Number(CheckFee) : Number(amount);
    const operationNum = Number(OperationNumber);

    if (
      !operationNum ||
      finalAmount <= 0 ||
      !textMessage.trim() ||
      !typePaid ||
      !requestId
    ) {
      toast.error("يرجى تعبئة جميع الحقول بشكل صحيح", {
        position: "top-right",
        theme: isDarkMode ? "dark" : "light",
      });
      return;
    }

    const token = Cookies.get("token");

    const paymentData = {
      typePaid,
      OperationNumber: operationNum,
      ...(isInspectionPayment
        ? { CheckFee: finalAmount }
        : { amount: finalAmount }),
      textMessage,
    };

    const apiUrl = isInspectionPayment
      ? `${API_BASE_URL}/maintenance-requests/${requestId}/accept_check`
      : `${API_BASE_URL}/epaid/${requestId}`;

    setIsLoading(true);
    try {
      await axios.post(apiUrl, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("تمت عملية الدفع بنجاح", {
        position: "top-right",
        theme: isDarkMode ? "dark" : "light",
      });
      closeModal();
      update();
    } catch (error: unknown) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.data &&
        (error.response.data as { message?: string }).message
      ) {
        const errorMessage = (error.response.data as { message: string })
          .message;
        toast.error(`حدث خطأ: ${errorMessage}`, {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
        });
      } else {
        toast.error("حدث خطأ أثناء عملية الدفع", {
          position: "top-right",
          theme: isDarkMode ? "dark" : "light",
        });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 max-h-[90vh] ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white" 
          : "bg-gradient-to-br from-white to-gray-50 text-gray-800"
      }`}
    >
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 left-4 z-10 bg-red-500/20 hover:bg-red-500/40 rounded-full p-2 transition-all duration-300"
      >
        <X size={24} className="text-red-500" />
      </button>

      {step === 1 ? (
        <div className="p-6 h-full flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center">
            اختر طريقة الدفع
          </h2>
          <div className="flex justify-center items-center gap-8">
            <div 
              className="transform transition-all duration-300 hover:scale-110 hover:shadow-2xl rounded-full"
              onClick={() => handleTypeSelect("SYRIATEL_CACH")}
            >
              <Image
                src={SyriatelImage}
                alt="Syriatel Payment"
                width={150}
                height={150}
                className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover cursor-pointer border-4 border-green-500"
              />
            </div>
            <div 
              className="transform transition-all duration-300 hover:scale-110 hover:shadow-2xl rounded-full"
              onClick={() => handleTypeSelect("MTN_CACH")}
            >
              <Image
                src={MTNImage}
                alt="MTN Payment"
                width={150}
                height={150}
                className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover cursor-pointer border-4 border-yellow-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 relative">
          <div className="flex items-center mb-4">
            <button 
              onClick={handleBack} 
              className="text-gray-500 hover:text-gray-700 mr-4"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-2xl font-bold flex-grow text-center">
              تفاصيل الدفع
            </h2>
          </div>

          <div className="mb-4 text-center">
            <Image
              src={typePaid === "SYRIATEL_CACH" ? SyriatelImage : MTNImage}
              alt="Selected Payment"
              width={100}
              height={100}
              className="rounded-full w-24 h-24 object-cover mx-auto mb-4 border-4 border-primary"
            />
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                رقم عملية التحويل
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={OperationNumber}
                  onChange={(e) => setOperationNumber(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                  placeholder="أدخل رقم العملية"
                />
                <CreditCard 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  size={18} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                المبلغ
              </label>
              <input
                type="number"
                value={isInspectionPayment ? CheckFee : amount}
                onChange={(e) =>
                  isInspectionPayment
                    ? setCheckFee(e.target.value)
                    : setAmount(e.target.value)
                }
                className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 text-sm ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="أدخل المبلغ"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                نص رسالة التحويل
              </label>
              <textarea
                value={textMessage}
                onChange={(e) => setTextMessage(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 text-sm min-h-[80px] ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                placeholder="أدخل رسالة التحويل"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-2 rounded-lg text-white font-bold transition-all duration-300 flex items-center justify-center text-sm ${
                isLoading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <ClipLoader size={20} color={"#ffffff"} />
              ) : (
                <>
                  <Check className="mr-2" size={18} />
                  إتمام عملية الدفع
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;