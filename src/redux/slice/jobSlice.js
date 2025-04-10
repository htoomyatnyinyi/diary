import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    selectedJobId: null,
  },
  reducers: {
    selectJob: (state, action) => {
      state.selectedJobId = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJobId = null;
    },
  },
});

export const { selectJob, clearSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
