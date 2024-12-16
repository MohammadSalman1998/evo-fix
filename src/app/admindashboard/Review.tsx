// src\app\admindashboard\Review.tsx
import React, { useEffect, useState } from "react";
import { useRepairRequests } from "@/app/context/adminData";
import { ClipLoader } from "react-spinners";
import { FaTrash, FaStar } from "react-icons/fa";
import Switch from "react-switch";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { API_BASE_URL } from "@/utils/api";
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion"; // Import for motion effects

const Review: React.FC = () => {
  const {
    reviews: contextReviews = [],
    fetchReviews,
    isReviewsLoading,
  } = useRepairRequests();
  const [reviews, setReviews] = useState(contextReviews);
  const [loading, setLoadingStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    setReviews(contextReviews);
  }, [contextReviews]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const token = Cookies.get("token");
      setLoadingStates((prev) => ({ ...prev, [id]: true }));
      await axios.put(
        `${API_BASE_URL}/review/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, isActive: !isActive } : review
        )
      );
      toast.success("تم تحديث حالة النشر!");
    } catch (err) {
      console.error("خطأ أثناء تحديث الحالة:", err);
      toast.error("حدث خطأ أثناء تحديث الحالة.");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const confirmDeleteReview = (id: number) => {
    confirmAlert({
      title: "تاكيد الحذف",
      message: "هل انت متاكد من حذف التقييم ؟",
      buttons: [
        {
          label: "نعم",
          onClick: () => handleDelete(id),
        },
        {
          label: "لا",
        },
      ],
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`${API_BASE_URL}/review/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );

      await fetchReviews();

      toast.success("تم حذف التقييم بنجاح!");
    } catch (err) {
      console.error("خطأ أثناء حذف التقييم:", err);
      toast.error("حدث خطأ أثناء الحذف.");
    }
  };

  if (isReviewsLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200 tracking-wide">
        التقييمات
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-lg text-gray-600 dark:text-gray-400 italic">
          لا توجد تقييمات حاليًا.
        </p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <motion.li
              key={review.id}
              className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl rounded-xl p-6 border border-gray-200 dark:border-gray-700 transform hover:scale-105 transition-transform duration-200 ease-in-out"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {review.user.fullName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  البريد الإلكتروني: {review.user.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  رقم الهاتف: {review.user.phoneNO}
                </p>
                <div className="flex items-center space-x-1 mt-3">
                  {[...Array(5)].map((_, index) => (
                    <FaStar
                      key={index}
                      className={`${
                        index < review.rating ? "text-yellow" : "text-gray-300"
                      } text-lg`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-gray-700 dark:text-gray-300">
                  {review.comment}
                </p>
              </div>
              <div className="flex items-center justify-between mt-4">
                {loading[review.id] && (
                  <CircularProgress size={16} className="inline ml-2" />
                )}
                <label>
                  <Switch
                    checked={review.isActive}
                    onChange={() =>
                      handleToggleActive(review.id, review.isActive)
                    }
                    onColor="#86d3ff"
                    offColor="#ccc"
                    width={48}
                    height={24}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    className="hover:scale-110 transition-transform duration-200"
                  />
                </label>
                <button
                  onClick={() => confirmDeleteReview(review.id)}
                  className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition-transform duration-200 transform hover:scale-110"
                >
                  <FaTrash className="text-xl" />
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Review;
