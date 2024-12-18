// src\app\page.tsx
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
import Reviews from "@/components/Review";
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
      <div className="fixed left-4 bottom-4 z-[90] flex flex-col space-y-2">
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
