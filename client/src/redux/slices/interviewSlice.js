import { createSlice } from "@reduxjs/toolkit";

const interviewSlice = createSlice({
  name: "interview",
  initialState: {
    current: null, currentIndex: 0, answers: [],
    status: "idle", report: null,
  },
  reducers: {
    setInterview(state, { payload }) { state.current = payload; state.answers = []; state.currentIndex = 0; },
    setCurrentIndex(state, { payload }) { state.currentIndex = payload; },
    saveAnswer(state, { payload: { index, answer } }) { state.answers[index] = answer; },
    setStatus(state, { payload }) { state.status = payload; },
    setReport(state, { payload }) { state.report = payload; },
    resetInterview(state) { state.current = null; state.currentIndex = 0; state.answers = []; state.status = "idle"; state.report = null; },
  },
});

export const { setInterview, setCurrentIndex, saveAnswer, setStatus, setReport, resetInterview } = interviewSlice.actions;
export default interviewSlice.reducer;
