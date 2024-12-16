// src\components\Invoices.tsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "@/app/context/ThemeContext";
import { ClipLoader } from "react-spinners";
import { Invoice } from "@/utils/types";
import { FaSync } from "react-icons/fa";
import {
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon,
} from "lucide-react";

const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  const [paymentStatus, setPaymentStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchInvoices = async () => {
    setLoading(true);
    const userRole =
      typeof window !== "undefined"
        ? localStorage.getItem("userRole") || "USER"
        : "USER";
    const endpoint = `${API_BASE_URL}/users/invoices`;

    try {
      const response = await axiosInstance.get<{
        adminInvoice: Invoice[];
        userInvoice: Invoice[];
      }>(endpoint);

      const invoiceData =
        response.data[userRole === "ADMIN" || userRole === "SUBADMIN"? "adminInvoice" : "userInvoice"];

      setInvoices(invoiceData || []);
      setFilteredInvoices(invoiceData || []);

      // تحقق من توفر `window` قبل استخدام `localStorage`
      if (typeof window !== "undefined") {
        localStorage.setItem("invoices", JSON.stringify(invoiceData || []));
      }

      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  // استرجاع البيانات من localStorage عند تحميل الصفحة
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInvoices = localStorage.getItem("invoices");
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices);
        setInvoices(parsedInvoices);
        setFilteredInvoices(parsedInvoices);
        setLoading(false);
      } else {
        fetchInvoices();
      }
    }
  }, []);

  useEffect(() => {
    const filtered = invoices.filter((invoice) => {
      const matchesStatus =
        paymentStatus === "all" ||
        (paymentStatus === "paid" && invoice.isPaid) ||
        (paymentStatus === "unpaid" && !invoice.isPaid);
      const matchesSearch = invoice.user.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
    setFilteredInvoices(filtered);
  }, [paymentStatus, searchTerm, invoices]);

  return (
    <div
      className={`container mx-auto p-4  min-h-screen ${
        isDarkMode
          ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
          : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
      }`}
    >
      {/* حاوية ثابتة شفافة للسحب للتحديث */}
      {/* <PullToRefresh onRefresh={fetchInvoices}>
        <div className="fixed flex iterm-center justify-center top-50 text-center left-0 right-0 h-10 bg-transparent z-10">
          <FaAngleDoubleDown className="mt-4 text-xl text-yellow-500 md:hidden" />
        </div>
      </PullToRefresh> */}

      <div className="flex items-center justify-between mb-4">
        {/* <h2 className="text-xl font-semibold">الفواتير</h2> */}
        <button
          onClick={fetchInvoices}
          className={`flex fixed to-55 left-4 items-center w-10 h-10 px-2 py-1 rounded z-30 text-white hover:text-gray-600 focus:outline-none`}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader color="#ffffff" loading={loading} size={20} />
          ) : (
            <FaSync className="mr-1" />
          )}
        </button>
      </div>

      <div
        className={` shadow-md rounded-lg p-6 ${
          isDarkMode
            ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
            : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
        }`}
      >
        <h1
          className={`text-2xl font-bold mb-4 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
              : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
          }`}
        >
          الفواتير
        </h1>

        {/* مكونات البحث والفلترة */}
        <div
          className={`flex space-x-4 mb-6 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
              : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
          }`}
        >
          <div
            className={`relative flex-grow ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
                : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
            }`}
          >
            <input
              type="text"
              placeholder="البحث بالاسم..."
              className={`w-full p-2 pl-8 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon
              className="absolute left-2 top-3 text-gray-400"
              size={20}
            />
          </div>

          <select
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
                : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
            }`}
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="all">كل الفواتير</option>
            <option value="paid">مدفوعة</option>
            <option value="unpaid">غير مدفوعة</option>
          </select>
        </div>

        {/* عرض الفواتير */}
        {loading ? (
          <div className="text-center py-6">
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : error ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            {error}
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600">لا توجد فواتير</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInvoices.map((invoice, index) => (
              <div
                key={index}
                className={` border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow ${
                  isDarkMode
                    ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2
                    className={`text-lg font-semibold ${
                      isDarkMode
                        ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-600 hover:border-blue-600"
                        : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400 hover:border-blue-400"
                    }`}
                  >
                    {invoice.user.fullName}
                  </h2>
                  {invoice.isPaid ? (
                    <CheckCircleIcon className="text-green-500" size={24} />
                  ) : (
                    <XCircleIcon className="text-red-500" size={24} />
                  )}
                </div>

                <div className="space-y-2 text-sm ">
                  <p>
                    <span className="font-medium">المبلغ:</span>{" "}
                    {invoice.amount} ل.س
                  </p>
                  <p>
                    <span className="font-medium">تاريخ الإصدار:</span>{" "}
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">تاريخ الاستحقاق:</span>{" "}
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>

                  <div className="border-t pt-2 mt-2">
                    <h3 className="font-semibold mb-2">تفاصيل الجهاز</h3>
                    <p>
                      <span className="font-medium">نوع الجهاز:</span>{" "}
                      {invoice.request.deviceType}
                    </p>
                    <p>
                      <span className="font-medium">موديل الجهاز:</span>{" "}
                      {invoice.request.deviceModel}
                    </p>
                    <p>
                      <span className="font-medium">الوصف:</span>{" "}
                      {invoice.request.problemDescription}
                    </p>
                    <p>
                      <span className="font-medium">المحافظة:</span>{" "}
                      {invoice.request.governorate}
                    </p>
                    <p>
                      <span className="font-medium">رسوم الكشف:</span>{" "}
                      {invoice.request.Epaid[0]?.CheckFee} ل.س
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
