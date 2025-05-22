import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    requests: [],
};

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        setRequests: (state, action) => {
            state.requests = action.payload;
        },
        addRequest: (state, action) => {
            state.requests.push(action.payload);
        },
        updateRequestStatus: (state, action) => {
            const { id, status } = action.payload;
            const request = state.requests.find((req) => req._id === id);
            if (request) {
                request.status = status;
            }
        },
        deleteRequest: (state, action) => {
            state.requests = state.requests.filter((req) => req._id !== action.payload);
        },
    },
});

export const { setRequests, addRequest, updateRequestStatus, deleteRequest } =
    requestsSlice.actions;
export default requestsSlice.reducer;
