// src\app\layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { DataCountsProvider } from "./context/DataCountsContext";
import Navbar from "@/components/navBar";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "EVOFIX",
  description: "Development By Mohammad Salman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
          style={{ zIndex: 1000 }}
        />

        <AuthProvider>
          <DataCountsProvider>
            <ThemeProvider>
              <Navbar />
              {children}
            </ThemeProvider>
          </DataCountsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
