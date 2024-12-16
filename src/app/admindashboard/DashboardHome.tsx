// src\app\admindashboard\DashboardHome.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { 
  Bell, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";
import { useDataCounts } from "../context/DataCountsContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardHome: React.FC = () => {
  const stats = useDataCounts();
  const [animatedStats, setAnimatedStats] = useState({
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    rejectedRequests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (stats?.fetchCounts) {
        await stats.fetchCounts();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (stats) {
      const animationDuration = 1500;
      const steps = 50;

      // const animateValue = (start: number, end: number) => {
      //   const stepValue = (end - start) / steps;
      //   let currentValue = start;

      //   const interval = setInterval(() => {
      //     currentValue += stepValue;
      //     if (Math.abs(currentValue - end) <= Math.abs(stepValue)) {
      //       currentValue = end;
      //       clearInterval(interval);
      //     }
      //     setAnimatedStats(prev => ({
      //       ...prev,
      //       [Object.keys(stats).find(key => stats[key] === end) || 'totalRequests']: Math.round(currentValue)
      //     }));
      //   }, animationDuration / steps);
      // };

      type DataCounts = {
        totalRequests: number;
        // Add other keys as needed
        [key: string]: number; // This allows for any string key to be used
    };

    const stats: DataCounts = {
      totalRequests: 0,
      // Initialize other keys as needed
  };

  const animateValue = (start: number, end: number) => {
    const stepValue = (end - start) / steps;
    let currentValue = start;

    const interval = setInterval(() => {
        currentValue += stepValue;
        if (Math.abs(currentValue - end) <= Math.abs(stepValue)) {
            currentValue = end;
            clearInterval(interval);
        }

        const key = Object.keys(stats).find(key => stats[key] === end);

        if (key && key in stats) {
            setAnimatedStats(prev => ({
                ...prev,
                [key as keyof DataCounts]: Math.round(currentValue) // Type assertion here
            }));
        } else {
            setAnimatedStats(prev => ({
                ...prev,
                totalRequests: Math.round(currentValue) // Fallback
            }));
        }
    }, animationDuration / steps);
};

      animateValue(0, stats.totalRequests);
      animateValue(0, stats.completedRequests);
      animateValue(0, stats.pendingRequests);
      animateValue(0, stats.inProgressRequests);
      animateValue(0, stats.rejectedRequests);
    }
  }, [stats]);

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const data = {
    labels: ["مكتملة", "معلقة", "قيد التنفيذ", "مرفوضة"],
    datasets: [
      {
        data: [
          animatedStats.completedRequests,
          stats.pendingRequests + stats.assignedRequests + stats.quotedRequests,
          animatedStats.inProgressRequests,
          animatedStats.rejectedRequests,
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#03A9F4", "#F44336"],
        hoverBackgroundColor: ["#45a049", "#ffb300", "#039BE5", "#e53935"],
      },
    ],
  };
  
  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    bgColor = "bg-white", 
    textColor = "text-blue-500" 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }:any) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${bgColor} dark:bg-gray-800 shadow-lg p-4 rounded-lg flex items-center space-x-4`}
    >
      <Icon className="text-gray-600 dark:text-gray-300" size={32} />
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {label}
        </h2>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="p-4 pt-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-gray-900 dark:text-white text-center"
      >
        لوحة التحكم الرئيسية
      </motion.h1>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.notifications > 0 && (
          <StatCard 
            icon={Bell} 
            label="الإشعارات غير المقروءة" 
            value={stats.notifications} 
            bgColor="bg-blue-50" 
            textColor="text-blue-600" 
          />
        )}
        <StatCard 
          icon={FileText} 
          label="جميع الطلبات" 
          value={animatedStats.totalRequests} 
        />
        <StatCard 
          icon={CheckCircle} 
          label="الطلبات المكتملة" 
          value={animatedStats.completedRequests} 
          bgColor="bg-green-50" 
          textColor="text-green-600" 
        />
        <StatCard 
          icon={Clock} 
          label="الطلبات المعلقة" 
          value={animatedStats.pendingRequests} 
          bgColor="bg-yellow-50" 
          textColor="text-yellow-600" 
        />
        <StatCard 
          icon={AlertTriangle} 
          label="طلبات قيد المعاينة" 
          value={stats.assignedRequests} 
          bgColor="bg-orange-50" 
          textColor="text-orange-600" 
        />
        <StatCard 
          icon={Clock} 
          label="طلبات قيد الموافقة" 
          value={stats.quotedRequests} 
          bgColor="bg-indigo-50" 
          textColor="text-indigo-600" 
        />
        <StatCard 
          icon={Clock} 
          label="الطلبات قيد التنفيذ" 
          value={animatedStats.inProgressRequests} 
          bgColor="bg-blue-50" 
          textColor="text-blue-600" 
        />
        <StatCard 
          icon={XCircle} 
          label="الطلبات المرفوضة" 
          value={animatedStats.rejectedRequests} 
          bgColor="bg-red-50" 
          textColor="text-red-600" 
        />
      </div>

      {/* Doughnut Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          توزيع حالات الطلبات
        </h2>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md">
            <Doughnut 
              data={data} 
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: '#374151',
                      font: {
                        size: 14
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: '#1f2937',
                    titleColor: 'white',
                    bodyColor: 'white'
                  }
                }
              }} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHome;