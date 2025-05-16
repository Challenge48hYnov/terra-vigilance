import React from 'react';
import { Link } from 'react-router-dom';
import { Map, MessageSquare, Shield, Zap } from 'lucide-react';
import { useUserContext } from '../contexts/UserContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div>
      <section className="pt-6 pb-12">
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t("staySafe")}
          </motion.h1>
          <motion.p
            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("appDescription")}.
          </motion.p>
        </div>

        {/* Quick Access Buttons */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/map"
              className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                  <Map size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t("hazardMap")}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {t("hazardMapDescription")}
                </p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link 
              to="/resources" 
              className="block bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
                  <Shield size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Emergency Resources</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Find shelters, medical help, and supplies near you
                </p>
              </div>
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Link
              to="/chat"
              className="block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                  <MessageSquare size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t("localChat")}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {t("localChatDescription")}
                </p>
              </div>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Resources */}
        <div>
          <h2 className="text-2xl font-bold mb-4">{t("emergencyRessources")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4 flex-shrink-0">
                  <Shield size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("emergencyPkit")}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {t("emergencyPkit2")}
                  </p>
                </div>
              </div>
              <Link 
                to="/resources" 
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
              >
                {t("learn")}
              </Link>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-4 flex-shrink-0">
                  <Zap size={20} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t("lr_title")}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {t("lr_desc")}
                  </p>
                </div>
              </div>
              <Link
                to="/resources"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
              >
                {t("f_resources")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;