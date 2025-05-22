import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for fetching services
export const fetchServices = createAsyncThunk(
    "services/fetchServices",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get("http://localhost:3001/service-category", {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Fetched services data:", response.data); // Debugging API response

            return response.data;
        } catch (error) {
            console.error("Full error:", error);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "An unknown error occurred"
            );
        }
    }
);

const servicesSlice = createSlice({
    name: "services",
    initialState: {
        topServices: [],
        featuredServices: [],
        homeServices: [],
        selectedService: null,
        loading: false,
        error: null,
    },
    reducers: {
        selectService: (state, action) => {
            state.selectedService = {
                ...action.payload,
                agents: action.payload.agents || [], // Ensure agents array exists
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.serviceCategories = action.payload.serviceCategories || [];
                state.topServices = action.payload.topServices || [];
                state.featuredServices = action.payload.featuredServices || [];
                state.homeServices = action.payload.homeServices || [];
                state.error = null;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch services";
            });
    },
});

export const { selectService } = servicesSlice.actions;
export default servicesSlice.reducer;
