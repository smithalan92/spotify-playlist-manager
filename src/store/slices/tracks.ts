import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import api from "../../api";
import { shuffleArray } from "../../utils";
import { RootState } from "../store";

interface PlaylistObject {
  [key: string]: {
    originalTracks: SpotifyApi.TrackObjectFull[];
    shuffledTracks: SpotifyApi.TrackObjectFull[];
  };
}

interface TrackUpdateState {
  processed: number;
  total: number;
}

interface ShuffledTrackUpdate {
  playlistId: string;
  tracks: SpotifyApi.TrackObjectFull[];
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
    setShuffledTracksForPlaylist: (
      state,
      action: PayloadAction<ShuffledTrackUpdate>
    ) => {
      const { playlistId, tracks } = action.payload;
      state.playlists = {
        ...state.playlists,
        [playlistId]: {
          ...state.playlists[playlistId],
          shuffledTracks: tracks,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      loadTracksForPlaylist.fulfilled,
      (state, action: PayloadAction<loadTracksForPlaylistResponse>) => {
        const { playlistId, tracks } = action.payload;
        state.playlists = {
          ...state.playlists,
          [playlistId]: {
            originalTracks: tracks,
            shuffledTracks: shuffleArray(tracks),
          },
        };
      }
    );
  },
});

const selectTrackState = (state: RootState) => state.tracks;

export const selectTrackUpdateState = createSelector(
  [selectTrackState],
  (trackState): TrackUpdateState => {
    if (trackState.updateState) return trackState.updateState;
    return { processed: 0, total: 0 };
  }
);

export const selectOriginalTracksForPlaylist = (playListId: string) =>
  createSelector([selectTrackState], (trackState) => {
    return trackState.playlists[playListId]?.originalTracks ?? [];
  });

export const selectShuffledTracksForPlaylist = (playListId: string) =>
  createSelector([selectTrackState], (trackState) => {
    return trackState.playlists[playListId]?.shuffledTracks ?? [];
  });

export const { setUpdateState, setShuffledTracksForPlaylist } =
  trackSlice.actions;

export default trackSlice.reducer;
