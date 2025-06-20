import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// api base URL
//const url = "http://localhost:3000/";
const url = "https://cloud-storage-ten.vercel.app/";

// Async thunk for file upload functionality
export const uploadFile = createAsyncThunk(
  "uploadFile",
  async (
    fileData: { payload: FormData; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${url}api/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${fileData.token}`,
        },
        body: fileData.payload,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching database statistics
export const getDatabaseStats = createAsyncThunk(
  "getDatabaseStats",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/databaseinfo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching all files
export const getAllFiles = createAsyncThunk(
  "getAllFiles",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching all images
export const getAllImages = createAsyncThunk(
  "getAllImages",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllImages`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching all videos
export const getAllVideos = createAsyncThunk(
  "getAllVideos",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllVideos`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching all documents
export const getAllDocuments = createAsyncThunk(
  "getAllDocuments",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllDocuments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching all audio
export const getAllAudio = createAsyncThunk(
  "getAllAudio",
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAudio`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Inteface for delete arguments.
interface DeleteArgs {
  id: string;
  token: string;
}

// Async thunk for deleting single documents
export const deleteFile = createAsyncThunk(
  "deleteFile",
  async ({ id, token }: DeleteArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for downloading a file by ID
export const downloadFile = createAsyncThunk(
  "downloadFile",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      //  Parse as binary (blob)
      const blob = await response.blob();

      //  Extract filename from response headers
      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded_file";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      // Create a download link and trigger click
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      return { status: "success", filename };
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for deleting single image
export const deleteImage = createAsyncThunk(
  "deleteImage",
  async ({ id, token }: DeleteArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllImages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for downloading a file by ID
export const downloadImage = createAsyncThunk(
  "downloadImage",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllImages/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      //  Parse as binary (blob)
      const blob = await response.blob();

      //  Extract filename from response headers
      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded_file";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      // Create a download link and trigger click
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      return { status: "success", filename };
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for deleting single video
export const deleteVideo = createAsyncThunk(
  "deleteVideo",
  async ({ id, token }: DeleteArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllVideos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for downloading a file by ID
export const downloadVideo = createAsyncThunk(
  "downloadVideo",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllVideos/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      //  Parse as binary (blob)
      const blob = await response.blob();

      //  Extract filename from response headers
      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded_file";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      // Create a download link and trigger click
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      return { status: "success", filename };
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for deleting single documents
export const deleteDocument = createAsyncThunk(
  "deleteDocument",
  async ({ id, token }: DeleteArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllDocuments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for downloading a file by ID
export const downloadDocument = createAsyncThunk(
  "downloadDocument",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllDocuments/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      //  Parse as binary (blob)
      const blob = await response.blob();

      //  Extract filename from response headers
      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded_file";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      // Create a download link and trigger click
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      return { status: "success", filename };
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for deleting single audio
export const deleteAudio = createAsyncThunk(
  "deleteAudio",
  async ({ id, token }: DeleteArgs, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fethcAllAudio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for downloading a file by ID
export const downloadAudio = createAsyncThunk(
  "downloadAudio",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchAllAudio/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      //  Parse as binary (blob)
      const blob = await response.blob();

      //  Extract filename from response headers
      const disposition = response.headers.get("Content-Disposition");
      let filename = "downloaded_file";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/"/g, "").trim();
      }

      // Create a download link and trigger click
      const urlBlob = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(urlBlob);

      return { status: "success", filename };
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for fetching file properties.
export const getFileProp = createAsyncThunk(
  "getFileProp",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}api/fetchProp/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Async thunk for opening a file in a new tab
export const openFile = createAsyncThunk(
  "openFile",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/openFIle/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error in response!",
        }));
        return rejectWithValue(errorData);
      }

      // Open file in new tab
      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      window.open(urlBlob, "_blank");
      // Optionally revoke the object URL after some time
      setTimeout(() => window.URL.revokeObjectURL(urlBlob), 10000);
      return { status: "success" };
    } catch (error) {
      return rejectWithValue({ status: 500, error: error });
    }
  }
);

// Define the shape of database stats
interface FileTypeStat {
  type: string;
  count: number;
  size: string;
}

interface DatabaseStats {
  storage: {
    used: string;
    usedPercent: string;
    maxStorage: string;
  };
  fileStats: FileTypeStat[];
}

// State interface definition
interface FileUploadState {
  postFile: null; // Stores uploaded file data
  getDbStats: DatabaseStats | null; // Stores database statistics
  getAllData: null;
  getAllImages: null;
  getAllVideos: null;
  getAllDoc: null;
  getAllAud: null;
  deleteFile: null;
  isLoading: boolean; // Loading state indicator
  error: string | null; // Error message storage
}

// Initial state configuration
const initialState: FileUploadState = {
  postFile: null,
  getDbStats: null,
  getAllData: null,
  getAllImages: null,
  getAllVideos: null,
  getAllDoc: null,
  getAllAud: null,
  deleteFile: null,
  isLoading: false,
  error: null,
};

// Redux slice creation with reducers
const fileUploadSlice = createSlice({
  name: "fileUpload",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    //Handling upload file cases.
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postFile = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling fetch db stats.
    builder
      .addCase(getDatabaseStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDatabaseStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getDbStats = action.payload;
      })
      .addCase(getDatabaseStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling fetch all files.
    builder
      .addCase(getAllFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllData = action.payload;
      })
      .addCase(getAllFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling fetch all images.
    builder
      .addCase(getAllImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllImages = action.payload;
      })
      .addCase(getAllImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling fetch all videos.
    builder
      .addCase(getAllVideos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllVideos = action.payload;
      })
      .addCase(getAllVideos.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling fetch all doc.
    builder
      .addCase(getAllDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllDoc = action.payload;
      })
      .addCase(getAllDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling fetch all audio.
    builder
      .addCase(getAllAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllAud = action.payload;
      })
      .addCase(getAllAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    //Handling delete single file.
    builder
      .addCase(deleteFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteFile = action.payload;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling delete single image.
      .addCase(deleteImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteFile = action.payload;
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling delete single video.
      .addCase(deleteVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteFile = action.payload;
      })
      .addCase(deleteVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling delete single document.
      .addCase(deleteDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteFile = action.payload;
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling delete single audio.
      .addCase(deleteAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAudio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deleteFile = action.payload;
      })
      .addCase(deleteAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling download image.
      .addCase(downloadImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadImage.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(downloadImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling download video.
      .addCase(downloadVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadVideo.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(downloadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling download document.
      .addCase(downloadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadDocument.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(downloadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      })

      // Handling download audio.
      .addCase(downloadAudio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(downloadAudio.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(downloadAudio.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });

    // Handling fetching properties of file cases.
    builder
      .addCase(getFileProp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFileProp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.getAllData = action.payload;
        state.error = null;
      })
      .addCase(getFileProp.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as { message?: string })?.message ||
          "Something went wrong";
      });
  },
});

export const { clearError } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
