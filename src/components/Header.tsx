import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';


interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle dark mode toggle
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Handle header style change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm dark:bg-neutral-900/80'
          : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button
            className="mr-4 p-2 rounded-md lg:hidden hover:bg-gray-100 dark:hover:bg-neutral-800"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="flex items-center">
            <AlertTriangle size={24} className="text-danger mr-2" />
            <span className="text-xl font-bold">{t("appName")}</span>
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
            onClick={toggleDarkMode}
            aria-label={darkMode ? t("switchToLightMode") : t("switchToDarkMode")}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;