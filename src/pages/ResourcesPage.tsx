import React from 'react';
import { useTranslation } from 'react-i18next';

function ResourcesPage() {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("emergencyRessources")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t("emergencyContacts")}</h2>
          <ul className="space-y-2">
            <li>{t("emergencyNumber")}</li>
            <li>{t("policeNumber")}</li>
            <li>{t("fireDepartmentNumber")}</li>
            <li>{t("poisonControlNumber")}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t("medicalFacilities")}</h2>
          <ul className="space-y-2">
            <li>{t("localHospital")}</li>
            <li>{t("urgentCareCenter")}</li>
            <li>{t("pharmacies")}</li>
            <li>{t("mentalHealthSupport")}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t("emergencySupplies")}</h2>
          <ul className="space-y-2">
            <li>{t("firstAidKits")}</li>
            <li>{t("foodAndWater")}</li>
            <li>{t("Flashlights")}</li>
            <li>{t("radios")}</li>
          </ul>
        </div>
      </div>
      <hr className="my-12 border-t-2 border-primary-500 w-3/4 mx-auto rounded-full dark:border-primary-400" />

      <h1 className="text-3xl font-bold mb-6">{t("emergencyPreparedness")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t("emergencyKit")}</h2>
          <ul className="space-y-2">
            <li>• {t("water1")}</li>
            <li>• {t("np_food")}</li>
            <li>• {t("firstAidSupplies")}</li>
            <li>• {t("flash&batteries")}</li>
            <li>• {t("radios")}</li>
            <li>• {t("documents")}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t("family")}</h2>
          <ul className="space-y-2">
            <li>• {t("contact_info")}</li>
            <li>• {t("meet_location")}</li>
            <li>• {t("evacuation")}</li>
            <li>• {t("comm")}</li>
            <li>• {t("sn_cons")}</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{t("stay")}</h2>
          <ul className="space-y-2">
            <li>• {t("emergencyAlerts")}</li>
            <li>• {t("weather")}</li>
            <li>• {t("community")}</li>
            <li>• {t("services")}</li>
            <li>• {t("procedures")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;