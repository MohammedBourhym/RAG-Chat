import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { MoonIcon, SunIcon, BeakerIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <header className="bg-white dark:bg-secondary-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and App Name */}
        <div className="flex items-center space-x-3">
          <BeakerIcon className="h-8 w-8 text-primary-500" />
          <h1 className="text-xl font-semibold text-secondary-900 dark:text-white">EduN7 RAG Chatbot</h1>
        </div>

        {/* Right side items */}
        <div className="flex items-center space-x-4">
          {/* Upgrade Button */}
          <button className="hidden sm:block button-primary text-sm">
            Upgrade to Pro
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-100 dark:bg-secondary-700 hover:bg-gray-200 dark:hover:bg-secondary-600 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-secondary-600" />
            )}
          </button>

          {/* User Avatar */}
          <div className="relative group">
            <button className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-secondary-500 hover:text-secondary-700 dark:text-gray-300 dark:hover:text-white transition-colors" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-700 rounded-lg shadow-lg py-2 hidden group-hover:block fade-in">
              <a href="#profile" className="block px-4 py-2 text-sm text-secondary-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-600">
                Your Profile
              </a>
              <a href="#settings" className="block px-4 py-2 text-sm text-secondary-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-secondary-600">
                Settings
              </a>
              <a href="#logout" className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-secondary-600">
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
