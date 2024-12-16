// src\app\page.tsx
// "use client";
// import { NextPage } from "next";
// import React, { useContext } from "react";
// import ChatBotButton from "@/components/ChatbotButton";
// import ServiceSlider from "@/components/ServiceSlider";
// import { Toaster } from "react-hot-toast";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { ThemeContext } from "./context/ThemeContext";
// import RepairRequestButton from "@/components/requestbutton";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import ContactForm from "@/components/forms/ContactForm";
// import Reviews from "@/components/Review";
// import FAQ from "@/components/FAQ";
// import Footer from "@/components/footer";
// // import Link from "next/link";
// import About from "@/components/about";
// import Hero from "@/components/hero2";

// const Home: NextPage = () => {
//   const { isDarkMode } = useContext(ThemeContext);
//   const update = () => console.log("done");
//   return (
//     <div className={`  ${
//       isDarkMode ? "bg-gray-dark" : "light-bg-1"
//     }`}>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <RepairRequestButton update={update} />
//       <Toaster
//         position="top-right"
//         reverseOrder={false}
//         toastOptions={{
//           style: {
//             background: isDarkMode ? "#333" : "#fff",
//             color: isDarkMode ? "#fff" : "#000",
//             fontSize: "14px",
//           },
//         }}
//       />
//       <ChatBotButton />
//       <section>
//         <Hero/>
//       </section>
//       {/* <section
//         className={`hero h-screen pt-20 bg-fixed ${
//           isDarkMode ? "dark  text-white" : "light  text-black"
//         } py-10`}
//       > */}
//         {/* <div className="hero-overlay"></div> */}
//         {/* <div className="md:m-4 mx-auto  text-center md:text-left flex flex-col md:flex-row items-center justify-between "> */}
//           {/* Hero Text Section (Right Column) */}
//           {/* <div className="md:w-1/2 flex flex-col items-center text-center md:text-left z-20">
//             <h2 className="text-4xl font-bold">
//               نحن نصلح أجهزتك الإلكترونية بسرعة واحترافية
//             </h2>
//             <p className="mt-4 text-lg">
//               إصلاح الشاشات، استبدال البطاريات، والمزيد. اجعل جهازك يعمل كما لو
//               كان جديدًا مرة أخرى.
//             </p>
//             <Link
//               href="/register"
//               className={` ${
//                 isDarkMode ? "text-white" : "text-black"
//               } btn mt-6`}
//             >
//               إنشاء حساب
//             </Link>
//           </div> */}

//           {/* Slider Section (Left Column) */}
//           {/* <div className=" w-full z-20 h-screen  mt-8  md:mt-0 "> */}
//             {/* <ServiceSlider /> */}
//           {/* </div> */}
//         {/* </div> */}
//       {/* </section> */}

//       <About />

//      <div className="flex h-screen justify-around flex-wrap">
//      <section
//         className={` lg:w-1/2 md:w-1/4 sm:w-1/4 bg-fixed ${
//            isDarkMode ? "dark-bg-1" : "light-bg-1"
//          }  py-10`}
//        >
//          <Reviews />
//       {/* <a href="/reviews">Reviews</a> */}
//       </section>
//       <section
//         id=""
//         className={`p-10 lg:w-1/2 md:w-full sm:w-full  ${isDarkMode ? "dark-bg-1" : "light-bg-1"}`}
//       >
//         <div className="flex items-center ">
//           <div className="w-full">
//             <ContactForm />
//           </div>
//         </div>
//       </section>
//      </div>

//       <section
//         id=""
//         className={`reviews bg-fixed h-screen ${
//           isDarkMode ? "dark-bg-2" : "light-bg-2"
//         }  py-10`}
//       >
//         <div className="flex   items-center ">
//           <div className="w-full">
//             <FAQ />
//           </div>
//         </div>
//       </section>

//       <footer className={`py-6 ${isDarkMode ? "dark-bg-1" : "light-bg-1"}`}>
//         <Footer />
//       </footer>
//     </div>
//   );
// };

// export default Home;

"use client";
import { NextPage } from "next";
import React, { useContext } from "react";
import ChatBotButton from "@/components/ChatbotButton";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./context/ThemeContext";
import RepairRequestButton from "@/components/requestbutton";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ContactForm from "@/components/forms/ContactForm";
import Reviews from "@/components/Review";
import FAQ from "@/components/FAQ";
import Footer from "@/components/footer";
import About from "@/components/about";
import Hero from "@/components/hero2";

const Home: NextPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const update = () => console.log("done");

  return (
    <div
      className={`
        min-h-screen w-full 
        ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
        transition-colors duration-300
      `}
    >
      {/* توستات وإشعارات */}
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 10000 }}
        />

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: isDarkMode ? "#333" : "#fff",
            color: isDarkMode ? "#fff" : "#000",
            fontSize: "14px",
            maxWidth: "90%",
            width: "300px",
            zIndex:10000
          },
        }}
      />

      {/* أزرار التفاعل */}
      <div className="fixed left-4 bottom-4 z-40 flex flex-col space-y-2">
        <RepairRequestButton update={update} />
        <ChatBotButton />
      </div>

      {/* القسم الرئيسي */}
      <section className="w-full mb-12">
        <Hero />
      </section>

    


      {/* محتوى الصفحة */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* قسم حول */}
        <section className="w-full mb-12">
          <About />
        </section>

      

        {/* القسم التفاعلي */}
        {/* <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"> */}
        {/* المراجعات */}
        {/* <section 
            className={`
              w-full rounded-lg p-6 
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-200' 
                : 'bg-gray-100 text-gray-900'}
              transition-colors duration-300
            `}
          >
          </section> */}

        {/* نموذج التواصل */}
        {/* <section 
            className={`
              w-full rounded-lg p-6 
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-200' 
                : 'bg-gray-100 text-gray-900'}
              transition-colors duration-300
            `}
          >
            <ContactForm />
          </section>
        </div> */}

        {/* قسم الأسئلة الشائعة */}
        {/* <section
          className={`
            w-full mb-12 rounded-lg p-8 
            ${
              isDarkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-100 text-gray-900"
            }
            transition-colors duration-300
          `}
        >
          <FAQ />
        </section> */}
      </div>

      <section
          className={`
              w-full mb-12
            `}
        >
          <Reviews />
        </section>

      {/* التذييل */}
      <footer
        className={`
          w-full py-6 
          ${isDarkMode ? "bg-gray-900 border-t border-gray-700" : "bg-gray-100"}
          transition-colors duration-300
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </footer>
    </div>
  );
};

export default Home;
