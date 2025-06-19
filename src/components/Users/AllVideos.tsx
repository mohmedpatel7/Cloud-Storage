"use client";

import {
  FiVideo,
  FiMoreVertical,
  FiDownload,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getAllVideos, deleteVideo } from "@/Redux/slices/fileReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import Loader from "../common/Loader";

interface FileData {
  _id: string;
  originalName: string;
  storedName: string;
  filePath: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadDate: string;
}

interface GetAllDataResponse {
  message: string;
  status: number;
  Result: FileData[];
}

export default function AllVideos() {
  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  const fileUpload = useSelector((state: RootState) => state.fileUpload);
  const videosData = fileUpload?.getAllVideos as unknown as
    | GetAllDataResponse
    | undefined;

  const handleMenuClick = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === fileId ? null : fileId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest(".menu-container")) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuId]);

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const token = await getToken();
      if (token) {
        await dispatch(getAllVideos(token));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      setFetchLoading(true);
      const token = await getToken();
      if (token) {
        await dispatch(deleteVideo({ id, token }));
        await fetchData();
        // Optionally show a toast here
      }
    } catch (error) {
      // Optionally show a toast here
      console.error("Error deleting video:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {fetchLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
          <Loader />
        </div>
      ) : !videosData?.Result || videosData.Result.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="p-4 bg-red-50 rounded-full mb-4">
            <FiVideo size={48} color="#DC2626" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            No videos available
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {videosData.Result.map((file: FileData) => (
            <div
              key={file._id}
              className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                <div className="p-2 sm:p-2.5 md:p-3 bg-red-50 rounded-lg">
                  <FiVideo size={18} color="#DC2626" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
                    {file.originalName}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                    {formatFileSize(file.size)}
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 truncate">
                    {file.type}
                  </p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
                    Date: {new Date(file.uploadDate).toLocaleDateString()}
                  </p>
                </div>

                {/*menu part */}
                <div className="relative menu-container">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={(e) => handleMenuClick(file._id, e)}
                  >
                    <FiMoreVertical size={18} color="#4B5563" />
                  </button>
                  {openMenuId === file._id && (
                    <div className="absolute right-0 mt-2 w-36 sm:w-40 md:w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                      <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <FiInfo size={14} />
                        <span className="truncate">Properties</span>
                      </button>
                      <button className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                        <FiDownload size={14} />
                        <span className="truncate">Download</span>
                      </button>
                      <button
                        className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        onClick={() => handleDeleteVideo(file._id)}
                      >
                        <FiTrash2 size={14} />
                        <span className="truncate">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
