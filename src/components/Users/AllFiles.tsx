"use client";

import {
  FiImage,
  FiVideo,
  FiFileText,
  FiMusic,
  FiMoreVertical,
  FiDownload,
  FiTrash2,
  FiInfo,
  FiExternalLink,
  FiHardDrive,
} from "react-icons/fi";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  deleteFile,
  getAllFiles,
  downloadFile,
  getFileProp,
  openFile,
} from "@/Redux/slices/fileReducer";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import Loader from "../common/Loader";
import { useToast } from "../common/ToastProivder";

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

export default function AllFiles() {
  const dispatch = useAppDispatch();

  const { getToken } = useAuth();

  const { showToast } = useToast();

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);

  // Modal and file property state
  const [showPropModal, setShowPropModal] = useState(false);
  const [propLoading, setPropLoading] = useState(false);
  const [propError, setPropError] = useState<string | null>(null);
  const [fileProp, setFileProp] = useState<FileData | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const fileUpload = useSelector((state: RootState) => state.fileUpload);
  const getAllData = fileUpload?.getAllData as unknown as
    | GetAllDataResponse
    | undefined;

  // Helper to get icon and color for file type
  const getFileTypeIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return { icon: FiImage, bg: "bg-blue-50", color: "#1D4ED8" };
    } else if (type.startsWith("video/")) {
      return { icon: FiVideo, bg: "bg-red-50", color: "#DC2626" };
    } else if (type.startsWith("audio/")) {
      return { icon: FiMusic, bg: "bg-purple-50", color: "#7E22CE" };
    } else {
      return { icon: FiFileText, bg: "bg-green-50", color: "#16A34A" };
    }
  };

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

  // Handler for showing file properties
  const handleShowProperties = async (id: string) => {
    setPropLoading(true);
    setPropError(null);
    setShowPropModal(true);
    setFileProp(null);
    try {
      const token = await getToken();
      if (token) {
        const result = await dispatch(getFileProp({ id, token })).unwrap();
        setFileProp(result.result || null); // Adjust if API response differs
      } else {
        setPropError("No token found");
        showToast("No token found", "error");
      }
    } catch (error: unknown) {
      let message = "Failed to fetch properties";
      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "object" && error && "message" in error) {
        message = (error as { message?: string }).message || message;
      }
      setPropError(message);
      showToast(message, "error");
    } finally {
      setPropLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setFetchLoading(true);
      const token = await getToken();
      if (token) {
        await dispatch(getAllFiles(token));
      }
    } catch (error) {
      showToast(`${error}`);
      console.error("Error fetching data:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const token = await getToken();
      if (token) {
        await dispatch(deleteFile({ id, token }));
        await fetchData();
        showToast("Deleted.", "success");
      } else {
        showToast("Error While Deleting !");
      }
    } catch (error) {
      showToast(`${error}`);
      console.error("Error fetching data:", error);
    }
  };

  const handleDownloadFile = async (id: string) => {
    try {
      const token = await getToken();
      if (token) {
        await dispatch(downloadFile({ id, token }));
        showToast("File Dowloading", "success");
      }
    } catch (error) {
      // Optionally show a toast for error
      console.error("Error downloading file:", error);
    }
  };

  // Handler for opening file in new tab
  const handleOpenFile = async (id: string) => {
    try {
      const token = await getToken();
      if (token) {
        await dispatch(openFile({ id, token })).unwrap();
      }
    } catch {
      showToast("Failed to open file", "error");
    }
  };

  // Handler for closing modal and refreshing data
  const closeModal = async () => {
    setShowPropModal(false);
    setFileProp(null);
    setPropError(null);
    setOpenMenuId(null);
    await fetchData();
  };

  // Effect to close modal and menu on outside click
  useEffect(() => {
    if (!showPropModal) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPropModal]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Modal for file properties */}
      {showPropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}
          >
            {/* Large faded icon in modal background */}
            {fileProp && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                {(() => {
                  const { icon: Icon, color } = getFileTypeIcon(fileProp.type);
                  return (
                    <Icon size={160} color={color} style={{ opacity: 0.08 }} />
                  );
                })()}
              </div>
            )}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl font-bold transition-colors z-10"
              onClick={closeModal}
              style={{ lineHeight: 1 }}
            >
              ×
            </button>
            {propLoading ? (
              <div className="flex items-center justify-center min-h-[180px] z-10">
                <Loader />
              </div>
            ) : propError ? (
              <div className="text-red-500 z-10">{propError}</div>
            ) : fileProp ? (
              <div className="relative z-10">
                <h2 className="text-2xl font-extrabold mb-2 text-gray-800 flex items-center gap-2">
                  File Properties
                </h2>
                <div className="h-px bg-gray-200 my-3" />
                <div className="space-y-3 text-base">
                  <div>
                    <b>Name:</b>{" "}
                    <span className="text-gray-700">
                      {fileProp.originalName}
                    </span>
                  </div>
                  <div>
                    <b>Type:</b>{" "}
                    <span className="text-gray-700">{fileProp.type}</span>
                  </div>
                  <div>
                    <b>Size:</b>{" "}
                    <span className="text-gray-700">{fileProp.size} bytes</span>
                  </div>
                  <div>
                    <b>Date:</b>{" "}
                    <span className="text-gray-700">
                      {new Date(fileProp.uploadDate).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-colors"
                    onClick={() => fileProp && handleDownloadFile(fileProp._id)}
                  >
                    <FiDownload size={18} /> Download
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition-colors"
                    onClick={async () => {
                      if (fileProp) {
                        await handleDeleteFile(fileProp._id);
                        closeModal();
                      }
                    }}
                  >
                    <FiTrash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="z-10">No data found.</div>
            )}
          </div>
        </div>
      )}

      {fetchLoading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-3rem)]">
          <Loader />
        </div>
      ) : !getAllData?.Result || getAllData.Result.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="p-4 bg-blue-50 rounded-full mb-4">
            <FiHardDrive size={48} color="#1D4ED8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            No files available
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {getAllData?.Result?.map((file: FileData) => {
            // Determine file type and icon
            let icon = FiFileText;
            let bgColor = "bg-green-50";
            let textColor = "#16A34A";

            if (file.type.startsWith("image/")) {
              icon = FiImage;
              bgColor = "bg-blue-50";
              textColor = "#1D4ED8";
            } else if (file.type.startsWith("video/")) {
              icon = FiVideo;
              bgColor = "bg-red-50";
              textColor = "#DC2626";
            } else if (file.type.startsWith("audio/")) {
              icon = FiMusic;
              bgColor = "bg-purple-50";
              textColor = "#7E22CE";
            }

            // Format file size
            const formatFileSize = (bytes: number) => {
              if (bytes === 0) return "0 Bytes";
              const k = 1024;
              const sizes = ["Bytes", "KB", "MB", "GB"];
              const i = Math.floor(Math.log(bytes) / Math.log(k));
              return (
                parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
              );
            };

            return (
              <div
                key={file._id}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 cursor-pointer hover:shadow-md transition-shadow"
                onDoubleClick={() => handleOpenFile(file._id)}
              >
                <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
                  <div className={`p-2 sm:p-2.5 md:p-3 ${bgColor} rounded-lg`}>
                    {icon({ size: 18, color: textColor })}
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
                        <button
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-blue-700 hover:bg-blue-50 flex items-center space-x-2"
                          onClick={() => handleOpenFile(file._id)}
                        >
                          <FiExternalLink size={14} />
                          <span className="truncate">Open</span>
                        </button>
                        <button
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          onClick={() => handleShowProperties(file._id)}
                        >
                          <FiInfo size={14} />
                          <span className="truncate">Properties</span>
                        </button>
                        <button
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          onClick={() => handleDownloadFile(file._id)}
                        >
                          <FiDownload size={14} />
                          <span className="truncate">Download</span>
                        </button>
                        <button
                          className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          onClick={() => handleDeleteFile(file._id)}
                        >
                          <FiTrash2 size={14} />
                          <span className="truncate">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
