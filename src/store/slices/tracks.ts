import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../api";
import { RootState } from "../store";

interface PlaylistObject {
  [key: string]: SpotifyApi.TrackObjectFull[];
}

interface TrackUpdateState {
  processed: number;
  total: number;
}

interface TracksState {
  playlists: PlaylistObject;
  isLoadingTracks: boolean;
  updateState: null | TrackUpdateState;
}

interface loadTracksForPlaylistResponse {
  tracks: SpotifyApi.TrackObjectFull[];
  playlistId: string;
}

const initialState: TracksState = {
  playlists: {},
  isLoadingTracks: false,
  updateState: null,
};

export const loadTracksForPlaylist = createAsyncThunk(
  "tracks/loadTracksForPlaylist",
  async (playlistId: string): Promise<loadTracksForPlaylistResponse> => {
    const tracks = await api.getPlaylistTracks(playlistId);
    return {
      playlistId,
      tracks,
    };
  }
);

export const trackSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setUpdateState: (state, action: PayloadAction<TrackUpdateState | null>) => {
      state.updateState = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(
      loadTracksForPlaylist.fulfilled,
      (state, action: PayloadAction<loadTracksForPlaylistResponse>) => {
        const { playlistId, tracks } = action.payload;
      }
    );
  },
});

const selectAppState = (state: RootState) => state.tracks;

export const selectTrackUpdateState = createSelector(
  [selectAppState],
  (tracks): TrackUpdateState => {
    if (tracks.updateState) return tracks.updateState;
    return { processed: 0, total: 0 };
  }
);

export const { setUpdateState } = trackSlice.actions;

export default trackSlice.reducer;
