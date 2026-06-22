import { createSlice } from "@reduxjs/toolkit";

const resumeSlice = createSlice({
  name: "resume",
  initialState: { data: null, analysis: null, uploading: false, analyzing: false },
  reducers: {
    setResume(state, { payload })   { state.data     = payload; },
    setAnalysis(state, { payload }) { state.analysis  = payload; },
    setUploading(state, { payload }){ state.uploading = payload; },
    setAnalyzing(state, { payload }){ state.analyzing = payload; },
    clearResume(state) { state.data = null; state.analysis = null; },
  },
});

export const { setResume, setAnalysis, setUploading, setAnalyzing, clearResume } = resumeSlice.actions;
export default resumeSlice.reducer;
