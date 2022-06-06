import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Playlist, User } from "../../types";
import api from "../../api";

interface PlaylistState {
  playlists: Array<Playlist>;
  loading: boolean;
}

const initialState: PlaylistState = {
  playlists: [],
  loading: true,
};

interface fetchAllPlaylistsResponse {
  playlists: Array<SpotifyApi.PlaylistObjectSimplified>;
  currentUser: User;
}

export const fetchPlaylists = createAsyncThunk(
  "playlist/fetchAllPlaylists",
  async (_, thunkAPI) => {
    const playlists = await api.getPlaylists();
    const state: any = thunkAPI.getState();
    return {
      playlists,
      currentUser: state.auth.user,
    };
  }
);

export const playlistsSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      fetchPlaylists.fulfilled,
      (state, action: PayloadAction<fetchAllPlaylistsResponse>) => {
        const { playlists, currentUser } = action.payload;
        // Add user to the state array
        state.playlists = playlists
          .filter((playlist) => {
            return playlist.owner.id === currentUser.id;
          })
          .map(
            (playlist): Playlist => ({
              id: playlist.id,
              href: playlist.href,
              image: {
                height: playlist.images[0].height,
                width: playlist.images[0].width,
                url: playlist.images[0].url,
              },
              name: playlist.name,
              trackCount: playlist.tracks.total,
              snapshotId: playlist.snapshot_id,
            })
          );
        state.loading = false;
      }
    );
  },
});

export const { setLoading } = playlistsSlice.actions;

export default playlistsSlice.reducer;
