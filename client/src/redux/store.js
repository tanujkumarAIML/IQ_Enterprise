import { configureStore } from "@reduxjs/toolkit";
import interviewReducer from "./slices/interviewSlice";
import resumeReducer    from "./slices/resumeSlice";
import chatReducer      from "./slices/chatSlice";

const store = configureStore({
  reducer: {
    interview: interviewReducer,
    resume:    resumeReducer,
    chat:      chatReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export default store;
