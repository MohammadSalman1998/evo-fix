// src\components\footer.tsx
import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-12 relative overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* شروط الاستخدام */}
        <div className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">
          <a href="/terms" className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            شروط الاستخدام
          </a>
        </div>

        {/* حقوق النشر */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} جميع الحقوق محفوظة || 
          <span className="font-bold text-blue-600 mr-2">EVOFIX</span>
        </div>

        {/* أيقونات التواصل الاجتماعي */}
        <div className="flex items-center space-x-4">
          {[
            { 
              Icon: FaFacebookF, 
              href: "https://www.facebook.com/mohammad.salman.1998", 
              color: "text-blue-600 hover:bg-blue-100" 
            },
            { 
              Icon: FaLinkedinIn, 
              href: "https://www.linkedin.com/in/mohammad-salman-779559263", 
              color: "text-blue-800 hover:bg-blue-100" 
            },
            { 
              Icon: FaTwitter, 
              href: "https://x.com/M1998Salman", 
              color: "text-blue-400 hover:bg-blue-100" 
            },
            { 
              Icon: FaEnvelope, 
              href: "mailto:evolutionfix8@gmail.com", 
              color: "text-red-600 hover:bg-red-100" 
            },
            { 
              Icon: FaWhatsapp, 
              href: "https://api.whatsapp.com/send/?phone=+963960950112", 
              color: "text-green-600 hover:bg-green-100" 
            }
          ].map(({ Icon, href, color }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-3 rounded-full transition-all duration-300 ${color} bg-opacity-10 hover:scale-110`}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    </div>

    {/* الديكور الخلفي */}
    <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
      <svg width="200" height="200" viewBox="0 0 55 99" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle opacity="0.5" cx="49.5" cy="49.5" r="49.5" fill="#4A6CF7" />
      </svg>
    </div>
    
    <div className="absolute bottom-0 left-0 opacity-20 pointer-events-none">
      <svg width="150" height="150" viewBox="0 0 79 94" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          opacity="0.3"
          x="-41"
          y="26.9426"
          width="66.6675"
          height="66.6675"
          transform="rotate(-22.9007 -41 26.9426)"
          fill="url(#paint0_linear)"
        />
      </svg>
    </div>
  </footer>
  );
};

export default Footer;
