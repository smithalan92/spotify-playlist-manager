import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { load, save } from "redux-localstorage-simple";

import audioReducer from "./slices/audio";
import authReducer from "./slices/auth";
import playlistReducer from "./slices/playlist";
import tracksReducer from "./slices/tracks";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlist: playlistReducer,
    audio: audioReducer,
    tracks: tracksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      save({
        states: ["auth"], // Make sure you are loading / saving the slice
        namespace: "spotify_placelist_manager",
      })
    ),
  preloadedState: load({
    states: ["auth"],
    namespace: "spotify_placelist_manager",
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
