// src\components\forms\ServiceForm.tsx
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "@/app/context/ThemeContext";
interface ServiceFormProps {
  initialData?: {
    title: string;
    description: string;
    serviceImage?: File | null;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    serviceImage: File | null;
  }) => void;
  onClose: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  onSubmit,
  onClose,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [serviceImage, setServiceImage] = useState<File | null>(
    initialData?.serviceImage || null
  );
  const [preview, setPreview] = useState<string | null>(null);
  const { isDarkMode } = useContext(ThemeContext);
  useEffect(() => {
    // تحديث رابط المعاينة عند تغيير الصورة
    if (serviceImage) {
      const imagePreviewUrl = URL.createObjectURL(serviceImage);
      setPreview(imagePreviewUrl);

      // تنظيف الرابط عند مغادرة المكون
      return () => URL.revokeObjectURL(imagePreviewUrl);
    } else {
      setPreview(null); // إذا لم يكن هناك صورة
    }
  }, [serviceImage]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setServiceImage(event.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setServiceImage(null); // إزالة الصورة
    setPreview(null); // إعادة تعيين رابط المعاينة
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit({ title, description, serviceImage });
  };



  return (
    <div 
      className={`
        max-w-md mx-auto rounded-2xl shadow-2xl transition-all duration-300 ease-in-out
        ${isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
          : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800'}
      `}
    >
      {/* Dark/Light Mode Toggle */}
      {/* <div className="absolute top-4 right-4">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`
            p-2 rounded-full transition-colors duration-300
            ${isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-300 hover:bg-gray-400'}
          `}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div> */}

      <div className="p-6">
        <h3 className={`
          text-2xl font-bold mb-6 text-center pb-2 border-b-2
          ${isDarkMode 
            ? 'border-gray-700 text-white' 
            : 'border-gray-300 text-gray-800'}
        `}>
          {initialData ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium text-sm">عنوان الخدمة</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`
                w-full px-4 py-2 rounded-lg focus:ring-2 transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 text-white focus:ring-blue-600' 
                  : 'bg-white text-gray-800 focus:ring-blue-400'}
              `}
              placeholder="أدخل عنوان الخدمة"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm">وصف الخدمة</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={`
                w-full px-4 py-2 rounded-lg focus:ring-2 transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 text-white focus:ring-blue-600' 
                  : 'bg-white text-gray-800 focus:ring-blue-400'}
              `}
              placeholder="أدخل وصف الخدمة"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm">صورة الخدمة</label>
            <div 
              className={`
                border-2 border-dashed rounded-lg p-4 text-center
                ${isDarkMode 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-gray-300 bg-white'}
              `}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
              />
              <label 
                htmlFor="fileInput" 
                className={`
                  cursor-pointer px-4 py-2 rounded-lg inline-block transition-colors
                  ${isDarkMode 
                    ? 'bg-blue-700 text-white hover:bg-blue-600' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'}
                `}
              >
                اختر صورة
              </label>
            </div>

            {preview && (
              <div className="mt-4 relative">
                <Image
                  src={preview}
                  alt="معاينة الصورة"
                  width={200}
                  height={200}
                  className="mx-auto rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className={`
                    absolute top-0 right-0 mt-2 mr-2 p-1 rounded-full transition-colors
                    ${isDarkMode 
                      ? 'bg-red-700 text-white hover:bg-red-600' 
                      : 'bg-red-500 text-white hover:bg-red-600'}
                  `}
                >
                  ✖
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`
                flex-1 py-2 rounded-lg transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}
              `}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`
                flex-1 py-2 rounded-lg transition-all duration-300
                ${isDarkMode 
                  ? 'bg-blue-700 text-white hover:bg-blue-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'}
              `}
            >
              {initialData ? "حفظ" : "إضافة الخدمة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // return (
  //   <div
  //     className={`p-4 rounded shadow-lg ${
  //       isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
  //     }`}
  //   >
  //     <h3 className="text-xl font-semibold mb-4">
  //       {initialData ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
  //     </h3>
  //     <form
  //       onSubmit={handleSubmit}
  //       className={`p-2 ${
  //         isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
  //       }`}
  //     >
  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">عنوان الخدمة</label>
  //         <input
  //           type="text"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //           required
  //           className={`w-full border rounded p-2 ${
  //             isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
  //           }`}
  //           placeholder="أدخل عنوان الخدمة"
  //         />
  //       </div>
  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">وصف الخدمة</label>
  //         <textarea
  //           value={description}
  //           onChange={(e) => setDescription(e.target.value)}
  //           required
  //           className={`w-full border rounded p-2 ${
  //             isDarkMode ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
  //           }`}
  //           placeholder="أدخل وصف الخدمة"
  //         />
  //       </div>
  //       <div className="mb-4">
  //         <label className="block mb-1 font-medium">صورة الخدمة</label>
  //         <input
  //           type="file"
  //           accept="image/*"
  //           onChange={handleFileChange}
  //           className="w-full"
  //         />
  //         {preview && ( // عرض المعاينة إذا كانت موجودة
  //           <div className="mt-4">
  //             <Image
  //               src={preview}
  //               alt="معاينة الصورة"
  //               width={200}
  //               height={200}
  //               className="h-auto rounded"
  //             />
  //             <button
  //               type="button"
  //               onClick={handleRemoveImage}
  //               className="mt-2 bg-red-500 text-white rounded px-4 py-2"
  //             >
  //               إزالة الصورة
  //             </button>
  //           </div>
  //         )}
  //       </div>
  //       <div className="flex justify-between">
  //         <button
  //           type="button"
  //           onClick={onClose}
  //           className="bg-red-400 text-gray-700 rounded px-4 py-2"
  //         >
  //           إلغاء
  //         </button>
  //         <button
  //           type="submit"
  //           className="bg-blue-500 text-white rounded px-4 py-2"
  //         >
  //           {initialData ? "حفظ " : "إضافة الخدمة"}
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );
};

export default ServiceForm;
