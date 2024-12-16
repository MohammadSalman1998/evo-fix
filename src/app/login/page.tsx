// src\app\login\page.tsx
"use client";
import React, { useState, useContext, useEffect } from "react";
// import Navbar from "@/components/navBar";
import { ThemeContext } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../../utils/api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Modal from "react-modal";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { 
  // FaUser, 
  FaLock, 
  FaEnvelope, 
  FaSignInAlt,
  FaArrowLeft 
} from "react-icons/fa";
// import Link from "next/link";

const LoginForm = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (!validateEmail(email)) {
      setErrorMessage("يرجى إدخال بريد إلكتروني صالح.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage("يجب أن تكون كلمة المرور على الأقل 8 أحرف.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200 || response.status === 201) {
        const userId = response.data.info.id;
        const userRole = response.data.info.role;
        const userEmail = response.data.info.email;
        const token = response.data.token;

        Cookies.set("token", token, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
        });

        localStorage.setItem("userId", userId);
        localStorage.setItem("email", userEmail);
        localStorage.setItem("userRole", userRole);

        toast.success(response.data.message || "تم تسجيل الدخول بنجاح!");
        login(userEmail, userId);

        if (userRole === "ADMIN" || userRole === "SUBADMIN") {
          router.push("/admindashboard");
        } else if (userRole === "TECHNICAL") {
          router.push("/technicaldashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMessage(
          "خطأ في تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور."
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          `حدث خطأ: ${error.response.data.message || "غير معروف"}`
        );
      } else {
        setErrorMessage("تعذر الاتصال بالخادم. حاول مرة أخرى لاحقًا.");
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div 
    className={`
      min-h-screen 
      flex 
      items-center 
      justify-center 
      p-4 
      relative 
      overflow-hidden
      ${isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-100 to-white'
      }
    `}
  >
    {/* Decorative Background Elements */}
    <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
      <div 
        className={`
          absolute 
          rounded-full 
          opacity-20 
          ${isDarkMode 
            ? 'bg-blue-500' 
            : 'bg-blue-200'
          }
        `}
        style={{
          width: '400px',
          height: '400px',
          top: '-100px',
          left: '-100px',
          filter: 'blur(100px)'
        }}
      />
      <div 
        className={`
          absolute 
          rounded-full 
          opacity-20 
          ${isDarkMode 
            ? 'bg-purple-500' 
            : 'bg-purple-200'
          }
        `}
        style={{
          width: '300px',
          height: '300px',
          bottom: '-100px',
          right: '-100px',
          filter: 'blur(100px)'
        }}
      />
    </div>

    <Toaster />

    <div 
      className={`
        w-full 
        max-w-md 
        p-8 
        rounded-xl 
        shadow-2xl 
        relative 
        z-10 
        transform 
        transition-all 
        duration-300 
        hover:scale-105
        ${isDarkMode
          ? 'bg-gray-800 text-gray-100 border border-gray-700'
          : 'bg-white text-gray-800 border border-gray-200'
        }
      `}
     >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">
          {isDarkMode 
            ? <span className="text-blue-400">مرحبًا</span> 
            : <span className="text-blue-600">مرحبًا</span>
          }
        </h2>
        <p className="text-gray-500">سجل دخولك للمتابعة</p>
      </div>

      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 flex items-center">
            <FaArrowLeft className="mr-2" />
            {errorMessage}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaEnvelope 
                className={`
                  ${isDarkMode 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                  }
                `} 
              />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="البريد الإلكتروني"
              className={`
                w-full 
                pl-3 
                pr-10 
                py-3 
                rounded-lg 
                border 
                focus:outline-none 
                focus:ring-2 
                transition-all 
                duration-300
                ${isDarkMode
                  ? 'bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600'
                  : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300'
                }
              `}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <FaLock 
                className={`
                  ${isDarkMode 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                  }
                `} 
              />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className={`
                w-full 
                pl-3 
                pr-10 
                py-3 
                rounded-lg 
                border 
                focus:outline-none 
                focus:ring-2 
                transition-all 
                duration-300
                ${isDarkMode
                  ? 'bg-gray-700 text-gray-200 border-gray-600 focus:ring-blue-600'
                  : 'bg-gray-50 text-gray-800 border-gray-300 focus:ring-blue-300'
                }
              `}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 ml-3"
            >
              {showPassword ? (
                <EyeSlashIcon 
                  className={`
                    h-5 w-5 
                    ${isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `} 
                />
              ) : (
                <EyeIcon 
                  className={`
                    h-5 w-5 
                    ${isDarkMode 
                      ? 'text-gray-400 hover:text-gray-200' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `} 
                />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 mb-6">
          <a 
            href="/register" 
            className={`
              text-sm 
              hover:underline 
              transition-colors
              ${isDarkMode 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-700'
              }
            `}
          >
            إنشاء حساب جديد
          </a>
          <button
            type="button"
            onClick={toggleModal}
            className={`
              text-sm 
              hover:underline 
              transition-colors
              ${isDarkMode 
                ? 'text-gray-400 hover:text-gray-200' 
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            نسيت كلمة المرور؟
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full 
            py-3 
            rounded-lg 
            flex 
            items-center 
            justify-center 
            transition-all 
            duration-300 
            ${isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <FaSignInAlt className="ml-2" /> 
              تسجيل الدخول
            </>
          )}
        </button>
      </form>
    </div>

    {/* Reset Password Modal */}
    <Modal
      isOpen={isModalOpen}
      onRequestClose={toggleModal}
      contentLabel="Modal"
      className={`
        relative 
        rounded-lg 
        max-w-md 
        mx-auto 
        z-50 
        ${isDarkMode 
          ? 'bg-gray-800 text-white' 
          : 'bg-white text-black'
        }
      `}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
    >
      <ResetPasswordForm onClose={toggleModal} />
    </Modal>
  </div>
  );
};

export default LoginForm;
