"use client";

import { useState } from "react";
import { FiUpload, FiX, FiFile } from "react-icons/fi";
import { uploadFile } from "@/Redux/slices/fileReducer";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useToast } from "../common/ToastProivder";

const FileUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const { getToken } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Try to create preview for any file type
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.onerror = () => {
        setPreview(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleFileUpload = async () => {
    try {
      const token = await getToken();
      if (!token) return router.push("/singin");

      if (!selectedFile) return showToast("Please select file !", "warning");

      const formData = new FormData();
      formData.append("file", selectedFile);

      dispatch(uploadFile({ payload: formData, token }));
      showToast("Saved", "success");
      removeFile();
    } catch (error) {
      showToast("Internal Server Error !", "error");
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Upload File
        </h2>

        <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors border-gray-300 hover:border-blue-400">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex justify-center">
              <FiUpload size={48} color="#9CA3AF" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Click to select a file or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Any file type is supported
            </p>
          </label>
        </div>

        {selectedFile && (
          <div className="mt-6">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <FiFile size={48} color="#9CA3AF" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-500">
                    Type: {selectedFile.type || "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} color="#9CA3AF" />
              </button>
            </div>

            <button
              className="mt-4 w-full py-2 px-4 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
              onClick={handleFileUpload}
            >
              Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
