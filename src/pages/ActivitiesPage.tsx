import React, { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Compass,
  Calendar,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "../contexts/supabaseClient";
import { useTranslation } from "react-i18next";

// Define activity types
export interface ActivityItem {
  id: number;
  created_at: string;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  zone_id: number;
  disaster_id: number;
  image_url: string;
}

const ActivitiesPage: React.FC = () => {
  const { t } = useTranslation();
  const { activeAlerts } = useAlertContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [zones, setZones] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("activities")
        .select(`*, zones (name)`);
      // .select();
      console.log(data);
      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        setActivities(data as ActivityItem[]);
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchZones = async () => {
      const { data, error } = await supabase.from("zones").select("id, name");
      if (!error && data) setZones(data);
    };
    fetchZones();
  }, []);

  // Filter activities based on category, safety level, and search query
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getZoneName(activity.zone_id)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const getZoneName = (zoneId: number) => {
    const zone = zones.find((z) => z.id === zoneId);
    return zone ? zone.name : "Unknown zone";
  };

  // Check if an activity is in an area with active alerts
  const hasActiveAlert = (location: string) => {
    return activeAlerts.some(
      (alert) =>
        alert.location === location &&
        (alert.level === "emergency" || alert.level === "danger")
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("activities")}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          {t("discoverActivities")}
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search activities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="text-center text-neutral-500 flex justify-center items-center py-8">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-primary-500"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          {t("loadingActivities")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => {

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={activity.image_url}
                      alt={activity.name}
                      className="w-full h-48 object-cover"
                    />

                    {hasAlert && (
                      <div className="absolute top-2 left-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 animate-pulse">
                          <AlertTriangle size={12} className="mr-1" />
                          {t("alertInArea")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {activity.name}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
                      {activity.description}
                    </p>

                    <div className="space-y-2 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        <span>{getZoneName(activity.zone_id)}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        <span>
                          {t("startDate")}:{" "}
                          {new Date(activity.start_date).toLocaleString()}
                        </span>
                      </div>
                      {activity.end_date && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2" />
                          <span>
                            {t("endDate")}:{" "}
                            {new Date(activity.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full bg-white dark:bg-neutral-800 rounded-lg shadow-md p-8 text-center">
              <Activity size={40} className="mx-auto mb-4 text-neutral-400" />
              <h3 className="text-xl font-medium mb-2">{t("noActivities")}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {t("tryAjustingFilters")}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Safety Disclaimer */}
      <div className="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle
            size={20}
            className="mr-3 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0"
          />
          <div>
            <h3 className="font-semibold mb-1">{t("safetyDisclaimer")}</h3>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t("safetyDisclaimerDescription")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
