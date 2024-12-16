// src\components\navBar.tsx

"use client";

import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, FiUser, FiX, 
  FiSun , FiHelpCircle, 
  FiInfo, FiUserPlus , 
  // FiUsers,
  FiGrid
} from 'react-icons/fi';
// import { RiUserAddLine } from 'react-icons/ri'
import { FaList, FaMoon, FaSignOutAlt } from "react-icons/fa";

// Local imports
import { AuthContext } from "@/app/context/AuthContext";
import { ThemeContext } from "@/app/context/ThemeContext";
import EVOFIX from "./assets/images/EVOFIX.png";
import { 
  fetchNotificationsCount, 
  startNotificationsCount 
} from "@/utils/notification-count";

// TypeScript interface for Navbar props
interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ }) => {
  // State and context hooks
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const { isLoggedIn, logout } = useContext(AuthContext);
  
  // Local state management
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [notificationsCount, setNotificationsCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hooks and navigation
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: { 
      opacity: 0, 
      x: "100%", 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    }
  };

  // Navigation animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 120,
        damping: 10
      }
    }
  };

  // Effect for theme, role, and notifications
  useEffect(() => {
    // Toggle dark mode
    document.documentElement.classList.toggle("dark", isDarkMode);

    // Fetch user role and notifications
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    const fetchCount = async () => {
      try {
        const count = await fetchNotificationsCount();
        setNotificationsCount(count);
      } catch (error) {
        console.error("Error fetching notifications count:", error);
      }
    };
    
    fetchCount();
    const stopPolling = startNotificationsCount(setNotificationsCount);
    return () => stopPolling();
  }, [isDarkMode]);

  // Update active navigation item
  useEffect(() => {
    const itemMap: { [key: string]: string } = {
      "/": "home",
      "/about": "about",
      "/faq": "faq",
      "/services": "services",
      "/dashboard": "dashboard",
      "/admin-dashboard": "dashboard",
      "/login": "login",
      "/register": "register",
      "/joinus": "joinus"
    };
    setActiveItem(itemMap[pathname] || "");
  }, [pathname]);

  // Dropdown outside click handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll event listener
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Helper functions
  const toggleMenu = () => setIsOpen(!isOpen);
  const handleItemClick = (item: string) => {
    setActiveItem(item);
    setIsOpen(false);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح!");
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  // Navigation link components
  const NavLinks = ({ isMobile = false }) => (
    <div className={`
      flex ${isMobile ? 'flex-col space-y-4' : 'flex-row space-x-4'}
      items-center text-right
    `}>
      <Link
        href="/"
        className={`
          nav-item flex items-center gap-2 
          ${activeItem === "home" ? "text-blue-500" : ""}
          ${isMobile ? "py-2 px-4" : ""}
          hover:text-blue-600 transition-colors duration-300
        `}
        onClick={() => handleItemClick("home")}
      >
        <FiHome />
        الرئيسية
      </Link>

      <Link
        href="/#about"
        className={`
          nav-item flex items-center gap-2 
          ${activeItem === "about" ? "text-blue-500" : ""}
          ${isMobile ? "py-2 px-4" : ""}
          hover:text-blue-600 transition-colors duration-300
        `}
        onClick={() => handleItemClick("about")}
      >
        <FiInfo />
        من نحن
      </Link>

      <Link
        href="/faq"
        className={`
          nav-item flex items-center gap-2 
          ${activeItem === "faq" ? "text-blue-500" : ""}
          ${isMobile ? "py-2 px-4" : ""}
          hover:text-blue-600 transition-colors duration-300
        `}
        onClick={() => handleItemClick("faq")}
      >
        <FiHelpCircle />
        الأسئلة الشائعة
      </Link>
    </div>
  );

  const AuthLinks = ({ isMobile = false }) => (
    <div className={`
      flex ${isMobile ? 'flex-col space-y-4' : 'flex-row space-x-4'}
      items-center text-right
    `}>
      {!isLoggedIn ? (
        <>
          <Link
            href="/login"
            className={`
              nav-item flex items-center gap-2
              ${activeItem === "login" ? "text-blue-500" : ""}
              ${isMobile ? "py-2 px-4" : ""}
              hover:text-blue-600 transition-colors duration-300
            `}
            onClick={() => handleItemClick("login")}
          >
            <FiUser />
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className={`
              nav-item flex items-center gap-2
              ${activeItem === "register" ? "text-blue-500" : ""}
              ${isMobile ? "py-2 px-4" : ""}
              hover:text-blue-600 transition-colors duration-300
            `}
            onClick={() => handleItemClick("register")}
          >
            <FiUserPlus />
            إنشاء حساب
          </Link>
          {/* <Link
            href="/joinus"
            className={`
              nav-item flex items-center gap-2
              ${activeItem === "joinus" ? "text-blue-500" : ""}
              ${isMobile ? "py-2 px-4" : ""}
              hover:text-blue-600 transition-colors duration-300
            `}
            onClick={() => handleItemClick("joinus")}
          >
            <FiUsers  />
            انضم إلينا
          </Link> */}
        </>
      ) : (
        <>
          {(userRole === "ADMIN" || userRole === "SUBADMIN") && (
            <Link
              href="/admindashboard"
              className={`
                nav-item flex items-center gap-2 relative
                ${activeItem === "dashboard" ? "text-blue-500" : ""}
                ${isMobile ? "py-2 px-4" : ""}
                hover:text-blue-600 transition-colors duration-300
              `}
              onClick={() => handleItemClick("dashboard")}
            >
              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notificationsCount}
                </span>
              )}
              <FiGrid   />
              لوحة التحكم
            </Link>
          )}

          {userRole === "USER" && (
            <Link
              href="/dashboard"
              className={`
                nav-item flex items-center gap-2 relative
                ${activeItem === "dashboard" ? "text-blue-500" : ""}
                ${isMobile ? "py-2 px-4" : ""}
                hover:text-blue-600 transition-colors duration-300
              `}
              onClick={() => handleItemClick("dashboard")}
            >
              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notificationsCount}
                </span>
              )}
              <FiGrid   />
              لوحة التحكم
            </Link>
          )}

          {userRole === "TECHNICAL" && (
            <Link
              href="/technicaldashboard"
              className={`
                nav-item flex items-center gap-2 relative
                ${activeItem === "dashboard" ? "text-blue-500" : ""}
                ${isMobile ? "py-2 px-4" : ""}
                hover:text-blue-600 transition-colors duration-300
              `}
              onClick={() => handleItemClick("dashboard")}
            >
              {notificationsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notificationsCount}
                </span>
              )}
              <FiGrid   />
              لوحة التحكم
            </Link>
          )}

          <button
            onClick={handleLogout}
            className={`
              text-red-500 hover:text-red-700 flex items-center gap-2 
              transition-colors duration-300
              ${isMobile ? "py-2 px-4" : ""}
            `}
          >
            <FaSignOutAlt />
            تسجيل الخروج
          </button>
        </>
      )}
    </div>
  );

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`
        fixed top-0 left-0 right-0 z-20
        transition-all duration-300 
        ${isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 shadow-xl' 
          : 'bg-transparent'
        }
        backdrop-blur-md
      `}
    >
      <div className="fixed w-full top-0">
        {/* Large screen navigation */}
        <nav className={`
          flex justify-between items-center p-4 
          transition-colors duration-300 
          w-full z-[99]
          ${isDarkMode
            ? "dark:bg-gray-dark dark:shadow-sticky-dark bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm transition"
            : "absolute bg-gray-light !bg-opacity-80 shadow-sticky backdrop-blur-sm text-dark"
          }
        `}>
          {/* Logo and Theme Toggle Section */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleTheme} 
              className="text-2xl hover:rotate-180 transition-transform duration-300"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <FaMoon /> : <FiSun className="text-yellow-500" />}
            </button>

            <Link href="/" className="flex items-center">
              <Image
                src={EVOFIX}
                alt="شعار EVOFIX"
                width={60}
                height={40}
                className="object-contain mx-11"
              />
            </Link>
          </div>

          {/* Large Screen Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <NavLinks />
              <AuthLinks />
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-2xl focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Mobile Menu"
          >
            {isOpen ? (
              <FiX className={`${isDarkMode ? "text-white" : "text-blue-500"}`} />
            ) : (
              <FaList className={`${isDarkMode ? "text-white" : "text-blue-500"}`} />
            )}
          </button>
        </nav>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileMenuVariants}
              className={`
                md:hidden absolute w-full 
                transition-all duration-300 ease-in-out
                ${isDarkMode
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
                }
                shadow-lg
                overflow-hidden
              `}
            >
              <div className="flex flex-col space-y-4 p-6">
                <NavLinks isMobile={true} />
                <div className="border-t my-4 border-gray-300"></div>
                <AuthLinks isMobile={true} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Indicator */}
        {isScrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            className="
              absolute bottom-0 left-0 
              h-1 bg-blue-500 
              origin-left
              w-full
            "
          />
        )}
      </div>
    </motion.nav>
  );
};
export default Navbar

