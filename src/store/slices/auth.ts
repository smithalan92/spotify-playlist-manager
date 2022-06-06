import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types";
import api from "../../api";

interface AuthState {
  user: User | null;
  token: string;
  stateKey: string;
}

const initialState: AuthState = {
  user: null,
  token: "",
  stateKey: "",
};

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const user = await api.getUserProfile();
  return user;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setStateKey: (state, action: PayloadAction<string>) => {
      state.stateKey = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        // Add user to the state array
        state.user = action.payload;
      }
    );
  },
});

export const { setUser, setToken, setStateKey } = authSlice.actions;

export default authSlice.reducer;
