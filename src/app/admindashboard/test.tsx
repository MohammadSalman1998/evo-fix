// src\app\admindashboard\test.tsx
// src\components\hero2.tsx
// src\components\Hero\index.tsx
// import FAQ from "./FAQ";

// const Hero = () => {
//   return (
//     <>
//        <section
//         id="home"
//         className="relative z-10 h-screen overflow-hidden  pb-16 pt-[120px] dark:bg-gray-dark md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
//       >
//       <div className="container">
//           <div className="-mx-4 flex flex-wrap">
//             <div className="w-full px-4">
//               <div className="mx-auto max-w-[800px] text-center">
//                 <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
//                 منصة <span className="text-indigo-600">EvoFix</span> ترحب بكم
//                 </h1>
//                 <p className="mb-12 text-base !leading-relaxed text-body-color dark:text-body-color-dark sm:text-lg md:text-xl">
//                 تهدف منصتنا إلى خدمتكم لصيانة الأجهزة الكهربائية والإلكترونية
//                   في جميع المحافظات السورية مايميزنا هو وجود فريق فني مختص معتمد
//                   . بمجرد استلام طلب الصيانة، يتم تحديد موعد
//                   زيارة فريق الصيانة بأسرع وقت ممكن. نحرص على إتمام الصيانة
//                   بسرعة وبأعلى مستوى من الجودة.
//                 </p>
//                 <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
//                     {/* <div> */}
//                         <FAQ/>
//                     {/* </div> */}
//                   {/* <Link
//                     href="https://github.com/NextJSTemplates/startup-nextjs"
//                     className="inline-block rounded-sm bg-black px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-black/90 dark:bg-white/10 dark:text-white dark:hover:bg-white/5"
//                   >
//                     طلب صيانة جديد
//                   </Link> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="absolute right-0 top-0  z-[-1] opacity-30 lg:opacity-100">
//           <svg
//             width="450"
//             height="556"
//             viewBox="0 0 450 556"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <circle
//               cx="277"
//               cy="63"
//               r="225"
//               fill="url(#paint0_linear_25:217)"
//             />
//             <circle
//               cx="17.9997"
//               cy="182"
//               r="18"
//               fill="url(#paint1_radial_25:217)"
//             />
//             <circle
//               cx="76.9997"
//               cy="288"
//               r="34"
//               fill="url(#paint2_radial_25:217)"
//             />
//             <circle
//               cx="325.486"
//               cy="302.87"
//               r="180"
//               transform="rotate(-37.6852 325.486 302.87)"
//               fill="url(#paint3_linear_25:217)"
//             />
//             <circle
//               opacity="0.8"
//               cx="184.521"
//               cy="315.521"
//               r="132.862"
//               transform="rotate(114.874 184.521 315.521)"
//               stroke="url(#paint4_linear_25:217)"
//             />
//             <circle
//               opacity="0.8"
//               cx="356"
//               cy="290"
//               r="179.5"
//               transform="rotate(-30 356 290)"
//               stroke="url(#paint5_linear_25:217)"
//             />
//             <circle
//               opacity="0.8"
//               cx="191.659"
//               cy="302.659"
//               r="133.362"
//               transform="rotate(133.319 191.659 302.659)"
//               fill="url(#paint6_linear_25:217)"
//             />
//             <defs>
//               <linearGradient
//                 id="paint0_linear_25:217"
//                 x1="-54.5003"
//                 y1="-178"
//                 x2="222"
//                 y2="288"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" />
//                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
//               </linearGradient>
//               <radialGradient
//                 id="paint1_radial_25:217"
//                 cx="0"
//                 cy="0"
//                 r="1"
//                 gradientUnits="userSpaceOnUse"
//                 gradientTransform="translate(17.9997 182) rotate(90) scale(18)"
//               >
//                 <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
//               </radialGradient>
//               <radialGradient
//                 id="paint2_radial_25:217"
//                 cx="0"
//                 cy="0"
//                 r="1"
//                 gradientUnits="userSpaceOnUse"
//                 gradientTransform="translate(76.9997 288) rotate(90) scale(34)"
//               >
//                 <stop offset="0.145833" stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0.08" />
//               </radialGradient>
//               <linearGradient
//                 id="paint3_linear_25:217"
//                 x1="226.775"
//                 y1="-66.1548"
//                 x2="292.157"
//                 y2="351.421"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" />
//                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
//               </linearGradient>
//               <linearGradient
//                 id="paint4_linear_25:217"
//                 x1="184.521"
//                 y1="182.159"
//                 x2="184.521"
//                 y2="448.882"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" />
//                 <stop offset="1" stopColor="white" stopOpacity="0" />
//               </linearGradient>
//               <linearGradient
//                 id="paint5_linear_25:217"
//                 x1="356"
//                 y1="110"
//                 x2="356"
//                 y2="470"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" />
//                 <stop offset="1" stopColor="white" stopOpacity="0" />
//               </linearGradient>
//               <linearGradient
//                 id="paint6_linear_25:217"
//                 x1="118.524"
//                 y1="29.2497"
//                 x2="166.965"
//                 y2="338.63"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" />
//                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
//               </linearGradient>
//             </defs>
//           </svg>
//         </div>
//         <div className="absolute bottom-0 left-20 z-[-1] opacity-30 lg:opacity-100">
//           <svg
//             width="364"
//             height="201"
//             viewBox="0 0 364 201"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M5.88928 72.3303C33.6599 66.4798 101.397 64.9086 150.178 105.427C211.155 156.076 229.59 162.093 264.333 166.607C299.076 171.12 337.718 183.657 362.889 212.24"
//               stroke="url(#paint0_linear_25:218)"
//             />
//             <path
//               d="M-22.1107 72.3303C5.65989 66.4798 73.3965 64.9086 122.178 105.427C183.155 156.076 201.59 162.093 236.333 166.607C271.076 171.12 309.718 183.657 334.889 212.24"
//               stroke="url(#paint1_linear_25:218)"
//             />
//             <path
//               d="M-53.1107 72.3303C-25.3401 66.4798 42.3965 64.9086 91.1783 105.427C152.155 156.076 170.59 162.093 205.333 166.607C240.076 171.12 278.718 183.657 303.889 212.24"
//               stroke="url(#paint2_linear_25:218)"
//             />
//             <path
//               d="M-98.1618 65.0889C-68.1416 60.0601 4.73364 60.4882 56.0734 102.431C120.248 154.86 139.905 161.419 177.137 166.956C214.37 172.493 255.575 186.165 281.856 215.481"
//               stroke="url(#paint3_linear_25:218)"
//             />

//             <circle
//               opacity="0.8"
//               cx="214.505"
//               cy="60.5054"
//               r="49.7205"
//               transform="rotate(-13.421 214.505 60.5054)"
//               stroke="url(#paint4_linear_25:218)"
//             />
//             <circle cx="220" cy="63" r="43" fill="url(#paint5_radial_25:218)" />
//             <defs>
//               <linearGradient
//                 id="paint0_linear_25:218"
//                 x1="184.389"
//                 y1="69.2405"
//                 x2="184.389"
//                 y2="212.24"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint1_linear_25:218"
//                 x1="156.389"
//                 y1="69.2405"
//                 x2="156.389"
//                 y2="212.24"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint2_linear_25:218"
//                 x1="125.389"
//                 y1="69.2405"
//                 x2="125.389"
//                 y2="212.24"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint3_linear_25:218"
//                 x1="93.8507"
//                 y1="67.2674"
//                 x2="89.9278"
//                 y2="210.214"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" stopOpacity="0" />
//                 <stop offset="1" stopColor="#4A6CF7" />
//               </linearGradient>
//               <linearGradient
//                 id="paint4_linear_25:218"
//                 x1="214.505"
//                 y1="10.2849"
//                 x2="212.684"
//                 y2="99.5816"
//                 gradientUnits="userSpaceOnUse"
//               >
//                 <stop stopColor="#4A6CF7" />
//                 <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
//               </linearGradient>
//               <radialGradient
//                 id="paint5_radial_25:218"
//                 cx="0"
//                 cy="0"
//                 r="1"
//                 gradientUnits="userSpaceOnUse"
//                 gradientTransform="translate(220 63) rotate(90) scale(43)"
//               >
//                 <stop offset="0.145833" stopColor="white" stopOpacity="0" />
//                 <stop offset="1" stopColor="white" stopOpacity="0.08" />
//               </radialGradient>
//             </defs>
//           </svg>
//         </div>
//         <div className="absolute  bottom-0 left-0  z-[-1] opacity-50 lg:opacity-100">
//         <svg xmlns="http://www.w3.org/2000/svg" width={300} height={300} fill="none" viewBox="0 0 24 24">
//             <path fill="url(#paint0_linear_25:217)" opacity={0.1} d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
//           </svg>
//         </div>
//       </section>
//     </>
//   );
// };

// export default Hero;























// "use client";

// import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { toast } from "react-toastify";
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiHome, FiUser, FiX, 
//   FiSun , FiHelpCircle, 
//   FiInfo, FiUserPlus , 
//   FiGrid
// } from 'react-icons/fi';
// import { FaList, FaMoon, FaSignOutAlt } from "react-icons/fa";

// // Local imports
// import { AuthContext } from "@/app/context/AuthContext";
// import { ThemeContext } from "@/app/context/ThemeContext";
// import EVOFIX from "./assets/images/EVOFIX.png";
// import EVOFIXB from "./assets/images/EVOFIXB.png";
// import { 
//   fetchNotificationsCount, 
//   startNotificationsCount 
// } from "@/utils/notification-count";

// interface NavbarProps {
//   className?: string;
// }

// const Navbar: React.FC<NavbarProps> = ({ }) => {
//   // State and context hooks
//   const { toggleTheme, isDarkMode } = useContext(ThemeContext);
//   const { isLoggedIn, logout } = useContext(AuthContext);
  
//   // Local state management
//   const [isOpen, setIsOpen] = useState(false);
//   const [activeItem, setActiveItem] = useState("");
//   const [userRole, setUserRole] = useState<string | null>(null);
//   const [notificationsCount, setNotificationsCount] = useState<number>(0);
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Hooks and navigation
//   const pathname = usePathname();
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // مكوّن التأثيرات

//   // تحديث الدور عند تسجيل الدخول
//   useEffect(() => {
//     // التحقق مما إذا كان التطبيق يعمل على العميل
//     if (typeof window !== 'undefined') {
//       const role = localStorage.getItem("userRole");
//       setUserRole(role);
//     }
//   }, [isLoggedIn]); // الاعتماد على isLoggedIn للتحديث

//   // باقي الكود كما هو دون تغيير...

//   const AuthLinks = ({ isMobile = false }) => (
//     <div className={`
//       flex ${isMobile ? 'flex-col space-y-4' : 'flex-row space-x-4'}
//       items-center text-right
//     `}>
//       {!isLoggedIn ? (
//         <>
//           {/* روابط تسجيل الدخول والتسجيل كما هي */}
//         </>
//       ) : (
//         <>
//           {(userRole === "ADMIN" || userRole === "SUBADMIN") && (
//             <Link
//               href="/admindashboard"
//               className={`
//                 nav-item flex items-center gap-2 relative
//                 ${activeItem === "dashboard" ? "text-blue-500" : ""}
//                 ${isMobile ? "py-2 px-4" : ""}
//                 hover:text-blue-600 transition-colors duration-300
//               `}
//               onClick={() => handleItemClick("dashboard")}
//             >
//               {notificationsCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
//                   {notificationsCount}
//                 </span>
//               )}
//               <FiGrid />
//               لوحة التحكم الإدارية
//             </Link>
//           )}

//           {userRole === "USER" && (
//             <Link
//               href="/dashboard"
//               className={`
//                 nav-item flex items-center gap-2 relative
//                 ${activeItem === "dashboard" ? "text-blue-500" : ""}
//                 ${isMobile ? "py-2 px-4" : ""}
//                 hover:text-blue-600 transition-colors duration-300
//               `}
//               onClick={() => handleItemClick("dashboard")}
//             >
//               {notificationsCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
//                   {notificationsCount}
//                 </span>
//               )}
//               <FiGrid />
//               لوحة التحكم
//             </Link>
//           )}

//           {userRole === "TECHNICAL" && (
//             <Link
//               href="/technicaldashboard"
//               className={`
//                 nav-item flex items-center gap-2 relative
//                 ${activeItem === "dashboard" ? "text-blue-500" : ""}
//                 ${isMobile ? "py-2 px-4" : ""}
//                 hover:text-blue-600 transition-colors duration-300
//               `}
//               onClick={() => handleItemClick("dashboard")}
//             >
//               {notificationsCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
//                   {notificationsCount}
//                 </span>
//               )}
//               <FiGrid />
//               لوحة التحكم التقنية
//             </Link>
//           )}

//           <button
//             onClick={handleLogout}
//             className={`
//               text-red-500 hover:text-red-700 flex items-center gap-2 
//               transition-colors duration-300
//               ${isMobile ? "py-2 px-4" : ""}
//             `}
//           >
//             <FaSignOutAlt />
//             تسجيل الخروج
//           </button>
//         </>
//       )}
//     </div>
//   );

//   // باقي الكود كما هو دون تغيير...

//   return (
//     // عائد العرض الرئيسي كما هو
//   );
// };

// export default Navbar;





































// src\components\dashboard\Sidebar.tsx
// "use client";

// import React, { useState, useContext, useEffect } from "react";
// import Image from "next/image";
// import "./dashboard.css";
// import BottomNavbar from "./BottomNavbar";
// import { ThemeContext } from "@/app/context/ThemeContext";
// import { AuthContext } from "@/app/context/AuthContext";
// import technicalImage from "@/components/assets/images/technicalImage.png";
// import userImage from "@/components/assets/images/userImage.png";

// import {
//   FaBell,
//   FaUser,
//   FaSignOutAlt,
//   FaHome,
//   FaTools,
//   FaFileInvoice,
// } from "react-icons/fa";
// import { API_BASE_URL } from "../../utils/api";
// import Cookies from "js-cookie";
// import axios from "axios";
// import {
//   fetchNotificationsCount,
//   startNotificationsCount,
// } from "@/utils/notification-count";

// interface SidebarProps {
//   onSelectOption: (option: string) => void;
// }

// interface UserData {
//   id: string;
//   fullName: string;
//   email: string;
//   role: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({ onSelectOption }) => {
//   const { isDarkMode } = useContext(ThemeContext);
//   const { logout } = useContext(AuthContext);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState<UserData | null>(null);

//   // استرجاع الخيار النشط من localStorage أو تعيين القيمة الافتراضية
//   const [activeOption, setActiveOption] = useState<string>(() => {
//     return localStorage.getItem("activeOption") || "viewHome";
//   });

//   const [notificationsCount, setNotificationsCount] = useState<number>(0);

//   useEffect(() => {
//     const token = localStorage.getItem("email");
//     setIsLoggedIn(!!token);
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         const count = await fetchNotificationsCount();
//         setNotificationsCount(count);
//       } catch (error) {
//         console.error("Error fetching notifications count:", error);
//       }
//     };
//     fetchCount();
//   }, []);
//   useEffect(() => {
//     // بدء التحديث التلقائي
//     const stopPolling = startNotificationsCount(setNotificationsCount);

//     // تنظيف عند إزالة المكون
//     return () => stopPolling();
//   }, []);
//   const handleOptionSelect = (option: string) => {
//     setActiveOption(option);

//     // حفظ الخيار النشط في localStorage مع استثناء "profile"
//     if (option !== "profile") {
//       localStorage.setItem("activeOption", option);
//     }
//     onSelectOption(option);
//   };

//   const handleProfile = () => {
//     setActiveOption("profile");
//     onSelectOption("profile");
//   };

//   const handleLogout = () => {
//     logout();
//     localStorage.removeItem("activeOption");
//   };

//   const fetchUserData = async () => {
//     const userId = localStorage.getItem("userId");
//     const token = Cookies.get("token");
//     if (userId && token) {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
//           withCredentials: true,
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setUserData(response.data);
//       } catch (error: unknown) {
//         console.error("خطأ في تحميل بيانات المستخدم", error);
//       }
//     } else {
//       console.error("User ID أو token مفقود.");
//     }
//   };

//   const mainRow = [
//     {
//       key: "viewHome",
//       name: "الرئيسية",
//       icon: <FaHome className="text-2xl" />,
//     },
//     {
//       key: "viewRequests",
//       name: "طلبات الإصلاح",
//       icon: <FaTools className="text-2xl" />,
//     },
//     {
//       key: "Invoices",
//       name: "الفواتير",
//       icon: <FaFileInvoice className="text-2xl" />,
//     },
//     {
//       key: "notifications",
//       name: "الإشعارات",
//       icon: (
//         <div className="relative">
//           <FaBell className="text-2xl" />
//           {notificationsCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
//               {notificationsCount}
//             </span>
//           )}
//         </div>
//       ),
//     },
//     {
//       key: "profile",
//       name: "الملف الشخصي",
//       icon: <FaUser className="text-2xl" />,
//       onClick: handleProfile,
//     },
//   ];
//   const sidebarRow = mainRow.filter((option) => option.key !== "viewHome");

//   return (
//     <div className="flex min-h-screen mt-4 text-white">
//       <div
//         className={`hidden md:flex w-full p-4 flex-col flex-shrink-0 ${
//           isDarkMode ? "bg-gray-800" : "bg-gray-600"
//         }`}
//         style={{ minHeight: "100vh" }}
//       >
//         <div className="space-y-6 sticky top-0">
//           <div className="flex items-center mt-4">
//             <Image
//               src={
//                 userData && userData.role === "TECHNICAL"
//                   ? technicalImage
//                   : userImage
//               }
//               alt="Profile"
//               width={40}
//               height={40}
//               className="rounded-full object-cover"
//             />
//             <span className="ml-4 font-bold mr-4">
//               {userData ? userData.fullName : "Loading..."}
//             </span>
//           </div>

//           {sidebarRow.map((option) => (
//             <button
//               key={option.key}
//               onClick={() => handleOptionSelect(option.key)}
//               className={`flex items-center m-2 mt-3 ${
//                 activeOption === option.key
//                   ? "bg-blue-600 text-white"
//                   : isDarkMode
//                   ? "text-gray-300 hover:bg-blue-400 hover:text-white"
//                   : "text-white hover:bg-blue-400 hover:text-white"
//               } rounded p-2 transition-colors duration-200`}
//             >
//               {option.icon}
//               <span className="mr-2">{option.name}</span>
//             </button>
//           ))}

//           {isLoggedIn && (
//             <button
//               onClick={handleLogout}
//               className="flex items-center m-2 text-red-500 hover:text-red-700 rounded p-2 transition-colors duration-200"
//             >
//               <FaSignOutAlt className="text-2xl ml-2" />
//               <span className="mr-2">تسجيل الخروج</span>
//             </button>
//           )}
//         </div>
//       </div>

//       <BottomNavbar
//         mainRow={mainRow}
//         activeOption={activeOption}
//         handleOptionSelect={handleOptionSelect}
//         handleLogout={handleLogout}
//         handleProfile={handleProfile}
//         isDarkMode={isDarkMode}
//       />
//     </div>
//   );
// };

// export default Sidebar;






































// src\app\admindashboard\DevicesModels.tsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";
// import Modal from "react-modal";
// import { API_BASE_URL } from "@/utils/api";
// import DeviceModelForm from "@/components/forms/DeviceModelForm";
// import { ClipLoader } from "react-spinners";
// import { Switch } from "@mui/material";
// import { FiEdit, FiTrash, FiPlus, FiSun, FiMoon } from "react-icons/fi";
// import { confirmAlert } from "react-confirm-alert";
// import { DeviceModel } from "@/utils/types";
// import { useRepairRequests } from "@/app/context/adminData";

// const DevicesModels: React.FC = () => {
//   const {
//     deviceModels: contextDeviceModels,
//     // fetchDeviceModels,
//     isDeviceLoading,
//   } = useRepairRequests();
//   const [deviceModels, setDeviceModels] = useState<DeviceModel[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedModel, setSelectedModel] = useState<DeviceModel | null>(null);
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     // Check local storage or system preference
//     const savedMode = localStorage.getItem('theme');
//     if (savedMode) return savedMode === 'dark';
//     return window.matchMedia('(prefers-color-scheme: dark)').matches;
//   });

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     const newMode = !isDarkMode;
//     setIsDarkMode(newMode);
//     localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
//     // Apply dark mode to html element for global styling
//     document.documentElement.classList.toggle('dark', newMode);
//   };

//   // Apply theme on component mount
//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDarkMode);
//   }, []);

//   useEffect(() => {
//     setDeviceModels(contextDeviceModels);
//   }, [contextDeviceModels]);

//   const handleSaveModel = async (data: DeviceModel) => {
//     try {
//       const authToken = Cookies.get("token");

//       if (selectedModel) {
//         // Update existing model
//         await axios.put(
//           `${API_BASE_URL}/device-models/${selectedModel.id}`,
//           data,
//           {
//             headers: { Authorization: `Bearer ${authToken}` },
//           }
//         );
//         toast.success("تم تعديل الموديل بنجاح!");

//         // Update model locally
//         setDeviceModels((prev) =>
//           prev.map((model) => (model.id === selectedModel.id ? data : model))
//         );
//       } else {
//         // Add new model
//         const response = await axios.post(
//           `${API_BASE_URL}/device-models`,
//           data,
//           {
//             headers: { Authorization: `Bearer ${authToken}` },
//           }
//         );
//         toast.success(response.data.message || "تم إضافة الموديل بنجاح");

//         // Add new model locally using server data
//         setDeviceModels((prev) => [response.data.device_model, ...prev]);
//       }

//       setIsModalOpen(false);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (error) {
//       toast.error("حدث خطأ غير متوقع، الرجاء المحاولة لاحقًا");
//     }
//   };

//   const handleEditModel = (model: DeviceModel) => {
//     setSelectedModel(model);
//     setIsModalOpen(true);
//   };

//   const confirmDeleteModel = (id: number) => {
//     confirmAlert({
//       title: "تاكيد الحذف",
//       message: "هل انت متاكد من حذف الموديل ؟",
//       buttons: [
//         { label: "نعم", onClick: () => handleDeleteModel(id) },
//         { label: "لا" },
//       ],
//     });
//   };

//   const handleDeleteModel = async (id: number) => {
//     try {
//       const authToken = Cookies.get("token");
//       await axios.delete(`${API_BASE_URL}/device-models/${id}`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });
//       toast.success("تم حذف الموديل بنجاح");

//       // Remove model from local state
//       setDeviceModels((prev) => prev.filter((model) => model.id !== id));
//     } catch (error) {
//       toast.error("حدث خطأ اثناء الحذف");
//       console.error(error);
//     }
//   };

//   const handleToggleActive = async (model: DeviceModel) => {
//     setLoading(true);
//     try {
//       const authToken = Cookies.get("token");
//       const isActiveValue = !model.isActive;

//       await axios.put(
//         `${API_BASE_URL}/device-models/${model.id}`,
//         { isActive: isActiveValue },
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );
//       toast.success("تم تحديث حالة النشر!");

//       // Update active status locally
//       setDeviceModels((prev) =>
//         prev.map((m) =>
//           m.id === model.id ? { ...m, isActive: isActiveValue } : m
//         )
//       );
//     } catch (error) {
//       toast.error("حدث خطا غير متوقع.");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };


//   if (isDeviceLoading) {
//     return (
//       <div className="flex justify-center items-center h-96 bg-gray-50 dark:bg-gray-900">
//         <ClipLoader color="#4A90E2" size={50} />
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-6">
//       <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
//         {/* Mode Toggle Button */}
//         <div className="absolute top-4 right-4">
//           <button 
//             onClick={toggleDarkMode}
//             className="
//               p-2 rounded-full 
//               bg-gray-200 dark:bg-gray-700 
//               text-gray-800 dark:text-gray-200
//               hover:bg-gray-300 dark:hover:bg-gray-600
//               transition-colors duration-300
//             "
//           >
//             {isDarkMode ? <FiSun /> : <FiMoon />}
//           </button>
//         </div>

//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">موديلات الاجهزة</h2>
//           <button
//             onClick={() => {
//               setSelectedModel(null);
//               setIsModalOpen(true);
//             }}
//             className="
//               flex items-center 
//               bg-blue-600 hover:bg-blue-700 
//               dark:bg-blue-700 dark:hover:bg-blue-600 
//               text-white px-4 py-2 
//               rounded-lg transition-colors 
//               duration-300 shadow-md
//             "
//           >
//             <FiPlus className="ml-2" />
//             اضافة موديل جديد
//           </button>
//         </div>

//         {deviceModels.length > 0 ? (
//           <div className="space-y-4">
//             {deviceModels.map((model) => (
//               <div
//                 key={model.id}
//                 className={`
//                   flex flex-col md:flex-row justify-between 
//                   p-5 border rounded-lg shadow-sm
//                   ${model.isActive 
//                     ? 'bg-white dark:bg-gray-700 border-blue-100 dark:border-blue-900' 
//                     : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-70'}
//                   transition-all duration-300
//                 `}
//               >
//                 <div className="flex-grow">
//                   <div className="flex items-center mb-2">
//                     <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{model.title}</h3>
//                     <span
//                       className={`
//                         w-3 h-3 rounded-full mr-2 ml-2
//                         ${model.isActive ? 'bg-green-500' : 'bg-red-500'}
//                       `}
//                     ></span>
//                   </div>
//                   <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
//                     <p>الحالة: {model.isActive ? "فعال" : "غير فعال"}</p>
//                     <p>
//                       تاريخ الإنشاء{" "}
//                       {model.createAt
//                         ? new Date(model.createAt).toLocaleDateString()
//                         : "Not available"}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center mt-4 md:mt-0 space-x-4">
//                   <Switch
//                     checked={model.isActive}
//                     onChange={() => handleToggleActive(model)}
//                     color="primary"
//                   />
//                   <div className="flex space-x-3">
//                     <button
//                       onClick={() => handleEditModel(model)}
//                       disabled={loading}
//                       className="
//                         text-yellow-500 hover:text-yellow-600 
//                         dark:text-yellow-400 dark:hover:text-yellow-500
//                         transition-colors
//                       "
//                     >
//                       <FiEdit className="text-xl" />
//                     </button>
//                     <button
//                       onClick={() => confirmDeleteModel(model.id)}
//                       disabled={loading}
//                       className="
//                         text-red-500 hover:text-red-600 
//                         dark:text-red-400 dark:hover:text-red-500
//                         transition-colors
//                       "
//                     >
//                       <FiTrash className="text-xl" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//            لا يوجد موديلات متاحة حاليا
//           </div>
//         )}

//         {isModalOpen && (
//           <Modal
//             isOpen={isModalOpen}
//             onRequestClose={() => setIsModalOpen(false)}
//             ariaHideApp={false}
//             className="fixed inset-0 flex items-center justify-center p-4"
//             overlayClassName="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"
//           >
//             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
//               <DeviceModelForm
//                 onSubmit={handleSaveModel}
//                 onClose={() => setIsModalOpen(false)}
//                 initialData={selectedModel}
//                 services={selectedModel?.services || []}
//                 isActive={selectedModel ? !!selectedModel.isActive : false}
//               />
//             </div>
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DevicesModels;








































// // src\app\admindashboard\users\AddUserForm.tsx
// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { API_BASE_URL } from "@/utils/api";
// import { ThemeContext } from "../../context/ThemeContext";

// interface AddUserFormProps {
//   onSubmit: (data: UserFormData) => Promise<void>;
//   onClose: () => void;
// }

// interface UserFormData {
//   fullName: string;
//   phoneNO: string;
//   email: string;
//   governorate: string;
//   address: string;
//   role: "USER" | "SUBADMIN" | "TECHNICAL" | "ADMIN";
//   specialization?: string;
//   services?: string;
//   admin_governorate?: string;
//   password: string;
// }

// interface Service {
//   title: string;
// }

// const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit, onClose }) => {
//   const [formData, setFormData] = useState<UserFormData>({
//     fullName: "",
//     phoneNO: "",
//     email: "",
//     governorate: "",
//     address: "",
//     role: "USER",
//     password: "",
//     admin_governorate: "",
//     specialization: "",
//     services: "",
//   });

//   const [specializations, setSpecializations] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const { isDarkMode } = useContext(ThemeContext);
//   const userRole = localStorage.getItem("userRole");

//   useEffect(() => {
//     axios
//       .get(`${API_BASE_URL}/services`)
//       .then((response) => {
//         if (response.data.services && Array.isArray(response.data.services)) {
//           const titles = response.data.services.map(
//             (service: Service) => service.title
//           );
//           setSpecializations(titles);
//         }
//       })
//       .catch((error) => console.error("فشل في جلب الخدمات:", error));
//   }, []);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [name]: "", // Clear error for the field being changed
//     }));
//   };

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.fullName) {
//       newErrors.fullName = "يجب إدخال الاسم الكامل.";
//     }

//     if (!formData.phoneNO) {
//       newErrors.phoneNO = "رقم الهاتف مطلوب.";
//     } else if (!/^\d{10}$/.test(formData.phoneNO)) {
//       newErrors.phoneNO = "ادخل رقم هاتف صالح";
//     }

//     if (!formData.email) {
//       newErrors.email = "البريد الإلكتروني مطلوب.";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "البريد الإلكتروني غير صالح.";
//     }
//     if (!formData.address) {
//       newErrors.address = "العنوان مطلوب.";
//     } else if (formData.address.length < 10) {
//       newErrors.address = "يجب أن يكون العنوان أكثر من 10 أحرف.";
//     }

//     if (!formData.password) {
//       newErrors.password = "كلمة المرور مطلوبة.";
//     } else if (formData.password.length < 8) {
//       newErrors.password = "يجب أن تكون كلمة المرور أكثر من 8 أحرف.";
//     }

//     if (formData.role === "TECHNICAL") {
//       if (!formData.specialization) {
//         newErrors.specialization = "يجب اختيار الاختصاص.";
//       }

//       if (!formData.services) {
//         newErrors.services = "يجب إدخال الخدمات.";
//       }
//     }
//     if (formData.role === "SUBADMIN") {
//       if (!formData.admin_governorate) {
//         newErrors.admin_governorate = "حدد قطاع العمل";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0; // Return true if there are no errors
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return; // Stop submission if validation fails
//     }

//     setLoading(true);
//     try {
//       await onSubmit(formData);
//       toast.success("تم إضافة المستخدم بنجاح!");
//       onClose();
//     } catch (error) {
//       console.error("خطأ أثناء إضافة المستخدم:", error);
//       toast.error("حدث خطأ أثناء إضافة المستخدم. يرجى المحاولة مرة أخرى.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className={`overflow-y-auto max-h-screen custom-sidebar-scroll p-2${
//         isDarkMode ? "bg-gray-800" : "bg-gray-200"
//       }`}
//     >
//       <form
//         onSubmit={handleSubmit}
//         className={`p-4 rounded-lg shadow-md flex flex-col gap-y-2 md:grid md:grid-cols-2 gap-x-4 ${
//           isDarkMode ? "text-light" : "text-black"
//         }`}
//       >
//         <div className="mb-2">
//           <label className="block">الاسم الكامل:</label>
//           <input
//             type="text"
//             name="fullName"
//             value={formData.fullName}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.fullName && (
//             <span className="text-red-600">{errors.fullName}</span>
//           )}
//         </div>

//         <div className="mb-2">
//           <label className="block">رقم الهاتف:</label>
//           <input
//             type="text"
//             name="phoneNO"
//             value={formData.phoneNO}
//             onChange={handleChange}
//             required
//             className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.phoneNO && (
//             <span className="text-red-600">{errors.phoneNO}</span>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block">البريد الإلكتروني:</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.email && <span className="text-red-600">{errors.email}</span>}
//         </div>

//         <div className="mb-4">
//           <label className="block">المحافظة:</label>
//           <select
//             name="governorate"
//             value={formData.governorate}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">اختر المحافظة</option>
//             <option value="دمشق">دمشق</option>
//             <option value="ريف دمشق">ريف دمشق</option>
//             <option value="حمص">حمص</option>
//             <option value="حماه">حماه</option>
//             <option value="طرطوس">طرطوس</option>
//             <option value="اللاذقية">اللاذقية</option>
//             <option value="السويداء">السويداء</option>
//             <option value="القنيطرة">القنيطرة</option>
//             <option value="حلب">حلب</option>
//             <option value="الرقة">الرقة</option>
//             <option value="الحسكة">الحسكة</option>
//             <option value="دير الزور">دير الزور</option>
//             <option value="ادلب">ادلب</option>
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block">العنوان:</label>
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.address && (
//             <span className="text-red-600">{errors.address}</span>
//           )}
//         </div>

//         <div className="mb-4">
//           <label className="block">نوع المستخدم:</label>
//           <select
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             required
//             className="mt-1 text-black p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="USER">مستخدم</option>
//             <option value="TECHNICAL">تقني</option>
//             {userRole === "ADMIN" && <option value="ADMIN">مدير</option>}
//             {userRole === "ADMIN" && (
//               <option value="SUBADMIN">مدير محافظة</option>
//             )}
//           </select>
//         </div>

//         <div className="mb-4">
//           <label className="block">كلمة المرور:</label>
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="mt-1 p-2 text-black w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           {errors.password && (
//             <span className="text-red-600">{errors.password}</span>
//           )}
//         </div>

//         {formData.role === "TECHNICAL" && (
//           <>
//             <div className="mb-4">
//               <label className="block">الاختصاص:</label>
//               <select
//                 name="specialization"
//                 onChange={handleChange}
//                 className={`
//                     w-full pl-10 pr-3 py-2 rounded-lg
//                     ${isDarkMode 
//                       ? 'bg-gray-700 text-white border-gray-600' 
//                       : 'bg-white text-gray-900 border-gray-300'}
//                     border focus:outline-none focus:ring-2 focus:ring-blue-500
//                     transition duration-300
//                   `}              >
//                 <option value="">اختر الاختصاص</option>
//                 {specializations.map((spec) => (
//                   <option key={spec} value={spec}>
//                     {spec}
//                   </option>
//                 ))}
//               </select>
//               {errors.specialization && (
//                 <span className="text-red-600">{errors.specialization}</span>
//               )}
//             </div>

//             <div className="mb-4">
//               <label className="block">الخدمات:</label>
//               <input
//                 type="text"
//                 name="services"
//                 value={formData.services}
//                 onChange={handleChange}
//                 className={`
//                     w-full pl-10 pr-3 py-2 rounded-lg
//                     ${isDarkMode 
//                       ? 'bg-gray-700 text-white border-gray-600' 
//                       : 'bg-white text-gray-900 border-gray-300'}
//                     border focus:outline-none focus:ring-2 focus:ring-blue-500
//                     transition duration-300
//                   `}              />
//               {errors.services && (
//                 <span className="text-red-600">{errors.services}</span>
//               )}
//             </div>
//           </>
//         )}
//         {formData.role === "SUBADMIN" && (
//           <>
//             <div className="mb-4">
//               <label className="block">قطاع العمل:</label>
//               <select
//                 name="admin_governorate"
//                 value={formData.admin_governorate}
//                 onChange={handleChange}
//                 required
//                 className={`
//                     w-full pl-10 pr-3 py-2 rounded-lg
//                     ${isDarkMode 
//                       ? 'bg-gray-700 text-white border-gray-600' 
//                       : 'bg-white text-gray-900 border-gray-300'}
//                     border focus:outline-none focus:ring-2 focus:ring-blue-500
//                     transition duration-300
//                   `}              >
//                 <option value="">اختر المحافظة</option>
//                 <option value="دمشق">دمشق</option>
//                 <option value="ريف دمشق">ريف دمشق</option>
//                 <option value="حمص">حمص</option>
//                 <option value="حماه">حماه</option>
//                 <option value="طرطوس">طرطوس</option>
//                 <option value="اللاذقية">اللاذقية</option>
//                 <option value="السويداء">السويداء</option>
//                 <option value="القنيطرة">القنيطرة</option>
//                 <option value="حلب">حلب</option>
//                 <option value="الرقة">الرقة</option>
//                 <option value="الحسكة">الحسكة</option>
//                 <option value="دير الزور">دير الزور</option>
//                 <option value="ادلب">ادلب</option>
//               </select>
//             </div>
//           </>
//         )}

//         <button
//           type="submit"
//           className={`mt-4 p-2 rounded-lg ${
//             isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
//           } hover:bg-blue-700`}
//           disabled={loading}
//         >
//           {loading ? "جارٍ الإضافة..." : "إضافة مستخدم"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddUserForm;









