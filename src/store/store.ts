import { configureStore } from "@reduxjs/toolkit";
import { save, load } from "redux-localstorage-simple";
import authReducer from "./slices/auth";
import playlistReducer from "./slices/playlist";

// TODO - Dont save/load playlists to localstorage

export const store = configureStore({
  reducer: {
    auth: authReducer,
    playlist: playlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      save({
        states: ["auth", "playlist"], // Make sure you are loading / saving the slice
        namespace: "spotify_placelist_manager",
      })
    ),
  preloadedState: load({
    states: ["auth", "playlist"],
    namespace: "spotify_placelist_manager",
  }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
