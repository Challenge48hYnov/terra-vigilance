import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';

i18n
  // Charge les traductions depuis le backend (ex: /public/locales)
  .use(HttpApi)
  // Détecte la langue de l'utilisateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialise i18next
  .init({
    // Langues supportées
    supportedLngs: ['fr', 'en'],
    // Langue par défaut si la détection échoue ou si la langue n'est pas supportée
    fallbackLng: 'fr',
    // Namespace par défaut (correspond au nom du fichier JSON : translation.json)
    defaultNS: 'translation',
    // Active le mode debug en développement (optionnel)
    debug: process.env.NODE_ENV === 'development',
    // Options pour le détecteur de langue
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'], // Où sauvegarder la langue sélectionnée
    },
    // Options pour le backend HTTP
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Chemin vers vos fichiers de traduction
    },
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs par défaut
    },
  });

export default i18n;