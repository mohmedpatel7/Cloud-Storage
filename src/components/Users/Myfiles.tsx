"use client";

import {
  FiHardDrive,
  FiImage,
  FiVideo,
  FiFileText,
  FiMusic,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getDatabaseStats } from "@/Redux/slices/fileReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import Loader from "../common/Loader";

const MyFiles = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { getToken } = useAuth();

  const fileUpload = useSelector((state: RootState) => state.fileUpload);
  const getDbStats = fileUpload?.getDbStats;
  const isLoading = fileUpload?.isLoading;

  const fetchData = async () => {
    try {
      const token = await getToken();
      if (token) {
        dispatch(getDatabaseStats(token));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Add getToken as dependency

  const storageData = {
    total: getDbStats?.storage?.maxStorage,
    used: getDbStats?.storage?.used,
    percentage: getDbStats?.storage?.usedPercent,
  };

  const fileStats = [
    {
      type: getDbStats?.fileStats[0].type,
      count: getDbStats?.fileStats[0].count,
      size: getDbStats?.fileStats[0].size,
      icon: FiImage,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "#1D4ED8",
      route: "/allImages",
    },
    {
      type: getDbStats?.fileStats[1].type,
      count: getDbStats?.fileStats[1].count,
      size: getDbStats?.fileStats[1].size,
      icon: FiVideo,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "#DC2626",
      route: "/allVideos",
    },
    {
      type: getDbStats?.fileStats[2].type,
      count: getDbStats?.fileStats[2].count,
      size: getDbStats?.fileStats[2].size,
      icon: FiFileText,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "#16A34A",
      route: "/allDocuments",
    },
    {
      type: getDbStats?.fileStats[3].type,
      count: getDbStats?.fileStats[3].count,
      size: getDbStats?.fileStats[3].size,
      icon: FiMusic,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "#7E22CE",
      route: "/allAudio",
    },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
          <Loader />
        </div>
      ) : (
        <>
          {/* Storage Usage Card */}
          <div
            className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push("/allFiles")}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-2 sm:p-2.5 md:p-3 bg-blue-50 rounded-lg">
                  <FiHardDrive size={20} color="#1D4ED8" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    Storage Usage
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-500">
                    {storageData.used} GB of {storageData.total} GB used
                  </p>
                </div>
              </div>
              <span className="text-xs sm:text-sm md:text-base font-medium text-blue-600">
                {storageData.percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
              <div
                className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
                style={{ width: ${storageData.percentage}% }}
              ></div>
            </div>
          </div>

          {/* File Type Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {fileStats.map((stat) => (
              <div
                key={stat.type}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(stat.route)}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div
                    className={p-2 sm:p-2.5 md:p-3 ${stat.bgColor} rounded-lg}
                  >
                    <stat.icon size={18} color={stat.textColor} />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                      {stat.type}
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                      {stat.count} files
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                      {stat.size}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MyFiles; 
