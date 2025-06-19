import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API base URL
const url = "http://localhost:3000/";

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

// Async thunk for fetching all documents
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
  },
});

export const { clearError } = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
