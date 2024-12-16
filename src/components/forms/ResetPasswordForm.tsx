import React, { useContext, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { KeyRound, Send, Loader2 } from "lucide-react";

interface ResetPasswordFormProps {
  onClose: () => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  // تحقق من صحة البريد الإلكتروني
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // دالة لمعالجة إرسال الفورم
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // التحقق من صحة البريد الإلكتروني
    if (!validateEmail(email)) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/users/request-reset-password`, {
        email,
      });
      toast.success(
        "تم إرسال طلب استعادة كلمة المرور بنجاح، يرجى التحقق من بريدك الإلكتروني"
      );
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقًا");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`max-w-md w-full mx-auto p-8 rounded-2xl shadow-2xl 
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100' 
          : 'bg-gradient-to-br from-white to-gray-50 text-gray-900'
        } relative overflow-hidden`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-center mb-6"
      >
        <KeyRound 
          className="text-blue-500 mr-3" 
          size={40} 
        />
        <h2 className="text-3xl font-bold">
          استعادة كلمة المرور
        </h2>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="email" 
            className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            البريد الإلكتروني
          </label>
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl 
                bg-white/80 dark:bg-gray-700/50 
                border border-gray-300 dark:border-gray-600 
                focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all duration-300"
              placeholder="example@example.com"
              required
            />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center 
            py-3 rounded-xl text-white font-bold 
            transition-all duration-300 
            ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            }`}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} />
              جاري الإرسال...
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              إرسال
            </>
          )}
        </motion.button>
      </form>
      <ToastContainer 
        position="bottom-right"
        theme={isDarkMode ? "dark" : "light"}
      />
    </motion.div>
  );
};

export default ResetPasswordForm;