import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AudioState {
  url: string | null;
}

const initialState: AudioState = {
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
