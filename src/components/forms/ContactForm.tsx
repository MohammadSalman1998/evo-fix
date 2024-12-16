// src\components\forms\ContactForm.tsx
import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../app/context/ThemeContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '@/utils/api';
import { Mail, MessageSquare } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/contact-us`, formData);
      toast.success('تم إرسال رسالتك بنجاح!');
      setFormData({
        email: '',
        subject: '',
        content: ''
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`max-w-md mx-auto p-6 rounded-xl shadow-2xl transition-all duration-300 
      ${isDarkMode 
        ? 'bg-gray-800 text-white border-2 border-gray-700' 
        : 'bg-white text-gray-800 border border-gray-200'
      }`}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">اتصل بنا</h2>
        <p className="text-gray-500 text-sm">
          نحن هنا للاستماع إليك. أرسل لنا رسالتك وسنرد عليك قريبًا.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
       

        {/* حقل البريد الإلكتروني */}
        <div className="relative">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="email" 
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 pl-10 rounded-lg outline-none transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-gray-100 focus:ring-2 focus:ring-primary'
                }`}
              placeholder="example@email.com"
              required 
            />
          </div>
        </div>

        {/* حقل الموضوع */}
        <div className="relative">
          <label htmlFor="subject" className="block mb-2 text-sm font-medium">
            موضوع الرسالة
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full p-3 pl-10 rounded-lg outline-none transition-all duration-300
                ${isDarkMode 
                  ? 'bg-gray-700 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-gray-100 focus:ring-2 focus:ring-primary'
                }`}
              placeholder="عنوان رسالتك"
              required 
            />
          </div>
        </div>

        {/* حقل الرسالة */}
        <div>
          <label htmlFor="content" className="block mb-2 text-sm font-medium">
            محتوى الرسالة
          </label>
          <textarea 
            id="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className={`w-full p-3 rounded-lg outline-none transition-all duration-300
              ${isDarkMode 
                ? 'bg-gray-700 focus:ring-2 focus:ring-blue-500' 
                : 'bg-gray-100 focus:ring-2 focus:ring-primary'
              }`}
            placeholder="اكتب رسالتك هنا..."
            required 
          />
        </div>

        {/* زر الإرسال */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full p-3 rounded-lg text-white font-bold transition-all duration-300
            ${isLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            }`}
        >
          {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;