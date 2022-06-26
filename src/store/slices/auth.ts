import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";

import api from "../../api";
import { User } from "../../types";
import { RootState } from "../store";

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
    resetState: (state) => {
      Object.assign(state, { ...initialState });
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

const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuthed = createSelector(
  [selectAuthState],
  (auth) => auth.token.length > 0
);

export const selectStateKey = createSelector(
  [selectAuthState],
  (auth) => auth.stateKey
);

export const { setUser, setToken, setStateKey, resetState } = authSlice.actions;

export default authSlice.reducer;
