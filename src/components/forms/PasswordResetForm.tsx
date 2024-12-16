// src\components\forms\PasswordResetForm.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  CheckCircleIcon, 
  AlertCircleIcon,
  ShieldIcon
} from 'lucide-react';

interface Errors {
  password?: string;
  confirmPassword?: string;
}

interface PasswordResetFormProps {
  onSubmit: (newPassword: string, confirmPassword: string) => void;
  password: string;
  confirmPassword: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
  loading: boolean;
}

const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strengthLabels = ['ضعيفة', 'متوسطة', 'قوية', 'قوية جدًا'];
  const strengthColors = ['text-red-500', 'text-orange-500', 'text-green-500', 'text-green-700'];

  const strength = getStrength(password);

  return (
    <div className="flex items-center space-x-2 mt-2">
      {[...Array(4)].map((_, index) => (
        <div 
          key={index} 
          className={`h-1 w-1/4 rounded-full ${
            index < strength ? strengthColors[strength - 1] : 'bg-gray-300'
          }`}
        />
      ))}
      {password && (
        <span className={`text-sm ${strengthColors[strength - 1]}`}>
          {strengthLabels[strength - 1]}
        </span>
      )}
    </div>
  );
};

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  onSubmit,
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  darkMode,
  loading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    let valid = true;
    const errors: Errors = {};

    if (password.length < 8) {
      errors.password = "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل";
      valid = false;
    }

    if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) {
      errors.password = "يجب أن تحتوي كلمة المرور على حروف كبيرة، صغيرة، أرقام ورموز";
      valid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "كلمة المرور وتأكيد كلمة المرور غير متطابقين";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(password, confirmPassword);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        w-full max-w-md mx-auto p-8 rounded-3xl shadow-2xl relative overflow-hidden
        ${darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800' 
          : 'bg-gradient-to-br from-white to-gray-50 border border-gray-100'
        }
      `}
    >
      {/* Background Decorative Elements */}
      <div 
        className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -z-10"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -z-10"
        style={{ transform: 'translate(50%, 50%)' }}
      />

      <div className="text-center mb-8">
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="inline-block p-4 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-4"
        >
          <ShieldIcon 
            size={48} 
            className="text-blue-600 dark:text-blue-400 mx-auto" 
          />
        </motion.div>
        <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          أدخل كلمة مرور جديدة آمنة وقوية
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            htmlFor="password" 
            className={`
              flex items-center mb-2 text-sm font-medium
              ${darkMode ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            <LockIcon size={16} className="mr-2" />
            كلمة المرور الجديدة
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                // Clear previous password error
                setErrors(prev => ({ ...prev, password: '' }));
              }}
              className={`
                w-full px-4 py-3 pl-10 pr-12 rounded-lg transition-all duration-300
                ${darkMode 
                  ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-600' 
                  : 'bg-white text-gray-900 border border-gray-300 focus:border-blue-500'
                }
                ${errors.password ? 'border-red-500' : ''}
              `}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
          </div>
          <PasswordStrengthIndicator password={password} />
          <AnimatePresence>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center text-red-500 text-sm mt-2"
              >
                <AlertCircleIcon size={16} className="mr-2" />
                {errors.password}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div>
          <label 
            htmlFor="confirmPassword" 
            className={`
              flex items-center mb-2 text-sm font-medium
              ${darkMode ? 'text-gray-300' : 'text-gray-700'}
            `}
          >
            <LockIcon size={16} className="mr-2" />
            تأكيد كلمة المرور
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                // Clear previous confirm password error
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }}
              className={`
                w-full px-4 py-3 rounded-lg transition-all duration-300
                ${darkMode 
                  ? 'bg-gray-800 text-white border border-gray-700 focus:border-blue-600' 
                  : 'bg-white text-gray-900 border border-gray-300 focus:border-blue-500'
                }
                ${errors.confirmPassword ? 'border-red-500' : ''}
              `}
              required
            />
          </div>
          <AnimatePresence>
            {errors.confirmPassword && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center text-red-500 text-sm mt-2"
              >
                <AlertCircleIcon size={16} className="mr-2" />
                {errors.confirmPassword}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className={`
            w-full py-3 rounded-lg font-medium flex justify-center items-center transition-all duration-300
            ${loading
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : darkMode
              ? 'bg-blue-700 text-white hover:bg-blue-800'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          {loading ? (
            <div className="flex items-center">
              <span className="animate-spin mr-2">🔄</span>
              جاري التحديث...
            </div>
          ) : (
            <div className="flex items-center">
              <CheckCircleIcon className="mr-2" />
              تحديث كلمة المرور
            </div>
          )}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          أنشئ كلمة مرور قوية تحتوي على:
        </p>
        <div className={`text-xs mt-2 flex justify-center space-x-2 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <span>• حروف كبيرة وصغيرة</span>
          <span>• أرقام</span>
          <span>• رموز خاصة</span>
          <span>• 8 أحرف على الأقل</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordResetForm;