// src\app\admindashboard\users\UserCard.tsx
import { useContext } from "react";
import React from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Switch from "react-switch";
import { FaTrash, FaEye } from "react-icons/fa";

// Define the User interface to structure user data
interface User {
  displayId?: number;
  fullName: string;
  email: string;
  phoneNO: string;
  address: string;
  governorate: string;
  role: string;
  isActive: boolean;
}
// Define the properties passed to UserCard
interface UserCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onToggleActive: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onDelete,
  onView,
  onToggleActive,
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
    className={`border rounded-xl p-6 shadow-lg mb-6 w-full sm:w-auto ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} transition-all duration-300 ease-in-out transform hover:scale-105`}
  >
    <h3 className="text-2xl font-semibold mb-4 break-words text-center">
      {user.fullName}
    </h3>
    <div className="space-y-2 mb-4">
      <div className="flex justify-between flex-col items-center ">
        <p className="text-sm font-medium text-gray-400 overflow-auto">البريد الإلكتروني:</p>
        <p className="text-sm">{user.email}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-400">رقم الهاتف:</p>
        <p className="text-sm">{user.phoneNO}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-400">العنوان:</p>
        <p className="text-sm">{user.address}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-400">المحافظة:</p>
        <p className="text-sm">{user.governorate}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-400">نوع المستخدم:</p>
        <p className="text-sm">{user.role}</p>
      </div>
    </div>
  
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-3">
        <Switch
          className="ml-2"
          onChange={onToggleActive}
          checked={user.isActive}
          onColor="#4A90E2"
          offColor="#FF6347"
          height={20}
          width={40}
        />
        <span className={`text-sm font-medium ${user.isActive ? "text-green-500" : "text-red-500"}`}>
          {user.isActive ? "نشط" : "غير نشط"}
        </span>
      </div>
      <button
        onClick={onView}
        className="text-green-500 hover:text-green-700 font-semibold flex items-center space-x-1 transition duration-200 ease-in-out"
      >
        <FaEye className="ml-2"/>
        <span >عرض</span>
      </button>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 font-semibold flex items-center space-x-1 transition duration-200 ease-in-out"
      >
        <FaTrash className="ml-2"/>
        <span>حذف</span>
      </button>
    </div>
  </div>
  
  );
};

export default UserCard;
