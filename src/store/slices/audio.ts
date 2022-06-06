import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  url: string | null;
}

const initialState: AuthState = {
  url: null,
};

export const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setAudio: (state, action: PayloadAction<string | null>) => {
      state.url = action.payload;
    },
  },
});

export const { setAudio } = audioSlice.actions;

export default audioSlice.reducer;