import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: { activeChat: null, history: [], loading: false },
  reducers: {
    setActiveChat(state, { payload }) { state.activeChat = payload; },
    setChatHistory(state, { payload }){ state.history = payload; },
    addMessage(state, { payload }) { if (state.activeChat) state.activeChat.messages.push(payload); },
    setChatLoading(state, { payload }){ state.loading = payload; },
    clearChat(state) { state.activeChat = null; },
  },
});

export const { setActiveChat, setChatHistory, addMessage, setChatLoading, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
