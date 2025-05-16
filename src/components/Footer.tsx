import React from "react";
import { Github, Twitter, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-base font-semibold mb-3">{t("appName")}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              {t("appDescription")}
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"><Github size={18} /></a>
              <a href="#" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-sm">{t("resources")}</h4>
            <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("emergencyGuide")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("disasterTypes")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("preprationTips")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("communitySupport")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-sm">{t("about")}</h4>
            <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("ourMission")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("dataSources")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("privacyPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {t("contactUs")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            © {new Date().getFullYear()} {t("appName")}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center mt-2 md:mt-0">
            Made with <Heart size={12} className="mx-1 text-red-500" /> for safety
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
