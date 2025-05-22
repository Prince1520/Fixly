import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null, // Stores user details
    },
    reducers: {
        // Set authenticated user data
        setAuthUser: (state, action) => {
            if (action.payload) {
                state.user = {
                    _id: action.payload._id || "",
                    username: action.payload.username || "",
                    fullName: action.payload.fullName || "",
                    email: action.payload.email || "",
                    mobile: action.payload.mobile || "",
                    roles: action.payload.roles || [],
                };
            } else {
                state.user = null;
            }
        },
        logoutUser: (state) => {
            state.user = null; // Clear user data on logout
        }
    }
});

export const { setAuthUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
