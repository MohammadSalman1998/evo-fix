// src\components\Review.tsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/utils/api";
import { ThemeContext } from "../app/context/ThemeContext";
import {  FaStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    fullName: string;
  };
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  


  // جلب التقييمات من API
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/review`);
      setReviews(
        Array.isArray(response.data.allReviews) ? response.data.allReviews : []
      );
    } catch (error) {
      console.error("فشل في جلب التقييمات:", error);
      // toast.error("حدث خطأ أثناء جلب التقييمات.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userEmail = localStorage.getItem("email");
    if (!userEmail) {
      toast.error("يجب تسجيل الدخول لإضافة تقييم.");
      return;
    }

    if (!rating || !comment) {
      toast.error("يرجى تعبئة كل من التقييم والتعليق.");
      return;
    }

    setIsLoading(true);

    const token = Cookies.get("token");

    try {
      await axios.post(
        `${API_BASE_URL}/review`,
        { rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("تم إضافة التقييم بنجاح!");
      setRating(0);
      setHover(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      console.error("فشل في إضافة التقييم:", error);
      toast.error("حدث خطأ أثناء محاولة إضافة التقييم.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
    className={`
      w-full overflow-hidden relative z-10 py-16 md:py-20 lg:py-28
      ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}
      transition-colors duration-300
    `}
  >
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-extrabold mb-10 text-center pb-4 border-b border-gray-200 dark:border-gray-700">
        تقييمات المستخدمين
      </h2>
  
      {/* عرض التقييمات بشكل أفقي */}
      <div className="w-full overflow-x-auto">
        <div 
          className="
            flex gap-6 
            overflow-x-auto 
            scroll-smooth 
            whitespace-nowrap
            no-scrollbar  // Hide scrollbar but allow scrolling
            cursor-grab   // Show grab cursor for manual scrolling
            active:cursor-grabbing  // Change cursor when actively scrolling
          "
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review.id}
                className="
                  flex-shrink-0 w-80 
                  scroll-snap-align-center
                  bg-white dark:bg-gray-800 
                  rounded-xl shadow-lg 
                  p-6 
                  transform transition-transform 
                  hover:opacity-75
                "
                style={{
                  scrollSnapAlign: 'center'
                }}
              >
                <div className="flex flex-col items-center">
                  {/* اسم المستخدم */}
                  <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                    {review.user.fullName}
                  </h3>
  
                  {/* التقييم بالنجوم */}
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`
                          ${i < review.rating 
                            ? "text-yellow" 
                            : "text-gray-300 dark:text-gray-600"}
                          mx-1
                        `}
                      />
                    ))}
                  </div>
  
                  {/* نص التقييم */}
                  <p className="text-center text-gray-600 dark:text-gray-400 line-clamp-3">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-full py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                لا توجد تقييمات بعد.
              </p>
            </div>
          )}
        </div>
      </div>
  
      {/* زر إضافة تقييم */}
      <div className="text-center mt-10">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="
            bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md 
            transition-all duration-300 hover:bg-blue-700 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
            dark:bg-blue-500 dark:hover:bg-blue-600
          "
        >
          إضافة تقييم
        </button>
      </div>


    {/* نافذة منبثقة لإضافة تقييم جديد */}
    {isPopupOpen && (
      <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm p-4">
        <div 
          className={`
            w-full max-w-md rounded-xl shadow-2xl p-6 relative overflow-hidden
            ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}
          `}
        >
          {/* زر الإغلاق */}
          <button
            onClick={() => setIsPopupOpen(false)}
            className="
              absolute top-4 left-4 text-gray-500 dark:text-gray-300
              hover:text-gray-700 dark:hover:text-gray-100 
              transition-colors
            "
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h3 className="text-xl font-bold mb-6 text-center">
            أضف تقييمك
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* نجوم التقييم */}
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={28}
                  className={`
                    cursor-pointer mx-1 transition-colors duration-200
                    ${
                      i < (hover || rating)
                        ? "text-yellow"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  `}
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHover(i + 1)}
                  onMouseLeave={() => setHover(rating)}
                />
              ))}
            </div>

            {/* مربع التعليق */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="
                w-full p-3 border rounded-lg 
                dark:bg-gray-700 dark:border-gray-600
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-300
              "
              rows={4}
              placeholder="اكتب تعليقك هنا...."
              required
            />

            {/* زر الإرسال */}
            <button
              type="submit"
              className="
                w-full bg-blue-600 text-white py-3 rounded-lg shadow-md 
                transition-all duration-300 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                dark:bg-blue-500 dark:hover:bg-blue-600
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              disabled={isLoading}
            >
              {isLoading ? "جاري الإرسال..." : "إرسال التقييم"}
            </button>
          </form>
        </div>
      </div>
    )}
  </div>

      <div className="absolute right-0 top-5 z-[-1]">
        <svg
          width="238"
          height="531"
          viewBox="0 0 238 531"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            opacity="0.3"
            x="422.819"
            y="-70.8145"
            width="196"
            height="541.607"
            rx="2"
            transform="rotate(51.2997 422.819 -70.8145)"
            fill="url(#paint0_linear_83:2)"
          />
          <rect
            opacity="0.3"
            x="426.568"
            y="144.886"
            width="59.7544"
            height="541.607"
            rx="2"
            transform="rotate(51.2997 426.568 144.886)"
            fill="url(#paint1_linear_83:2)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_83:2"
              x1="517.152"
              y1="-251.373"
              x2="517.152"
              y2="459.865"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_83:2"
              x1="455.327"
              y1="-35.673"
              x2="455.327"
              y2="675.565"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" />
              <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute bottom-5 left-0 z-[-1]">
        <svg
          width="279"
          height="106"
          viewBox="0 0 279 106"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <path
              d="M-57 12L50.0728 74.8548C55.5501 79.0219 70.8513 85.7589 88.2373 79.3692C109.97 71.3821 116.861 60.9642 156.615 63.7423C178.778 65.291 195.31 69.2985 205.911 62.3533C216.513 55.408 224.994 47.7682 243.016 49.1572C255.835 50.1453 265.278 50.8936 278 45.3373"
              stroke="url(#paint0_linear_72:302)"
            />
            <path
              d="M-57 1L50.0728 63.8548C55.5501 68.0219 70.8513 74.7589 88.2373 68.3692C109.97 60.3821 116.861 49.9642 156.615 52.7423C178.778 54.291 195.31 58.2985 205.911 51.3533C216.513 44.408 224.994 36.7682 243.016 38.1572C255.835 39.1453 265.278 39.8936 278 34.3373"
              stroke="url(#paint1_linear_72:302)"
            />
            <path
              d="M-57 23L50.0728 85.8548C55.5501 90.0219 70.8513 96.7589 88.2373 90.3692C109.97 82.3821 116.861 71.9642 156.615 74.7423C178.778 76.291 195.31 80.2985 205.911 73.3533C216.513 66.408 224.994 58.7682 243.016 60.1572C255.835 61.1453 265.278 61.8936 278 56.3373"
              stroke="url(#paint2_linear_72:302)"
            />
            <path
              d="M-57 35L50.0728 97.8548C55.5501 102.022 70.8513 108.759 88.2373 102.369C109.97 94.3821 116.861 83.9642 156.615 86.7423C178.778 88.291 195.31 92.2985 205.911 85.3533C216.513 78.408 224.994 70.7682 243.016 72.1572C255.835 73.1453 265.278 73.8936 278 68.3373"
              stroke="url(#paint3_linear_72:302)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_72:302"
              x1="256.267"
              y1="53.6717"
              x2="-40.8688"
              y2="8.15715"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_72:302"
              x1="256.267"
              y1="42.6717"
              x2="-40.8688"
              y2="-2.84285"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_72:302"
              x1="256.267"
              y1="64.6717"
              x2="-40.8688"
              y2="19.1572"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
            <linearGradient
              id="paint3_linear_72:302"
              x1="256.267"
              y1="76.6717"
              x2="-40.8688"
              y2="31.1572"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4A6CF7" stopOpacity="0" />
              <stop offset="1" stopColor="#4A6CF7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

    </section>
  );
};

export default Reviews;
