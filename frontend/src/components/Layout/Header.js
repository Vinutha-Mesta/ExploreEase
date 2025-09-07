import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">TravelGenius</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 
