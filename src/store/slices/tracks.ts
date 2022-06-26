import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api";
import { delay, shuffleArray } from "../../utils";
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

export const saveShuffledTracks = createAsyncThunk(
  "tracks/saveShuffledTracks",
  async (playlistId: string, thunkApi): Promise<string> => {
    const state = <RootState>thunkApi.getState();
    const { originalTracks, shuffledTracks } =
      state.tracks.playlists[playlistId];

    const currentOrder = [...originalTracks.map((t) => t.uri)];
    const shuffled = shuffledTracks.map((t) => t.uri);

    let processedTracks = 0;
    const totalTracks = shuffled.length;
    let currentSnapshotId: string | undefined = undefined;

    for (const [index, shuffledItem] of shuffled.entries()) {
      const currentTrackIndex = currentOrder.findIndex(
        (item) => item === shuffledItem
      );
      if (currentTrackIndex === index) {
        processedTracks += 1;
        await thunkApi.dispatch(
          setUpdateState({
            processed: processedTracks,
            total: totalTracks,
          })
        );

        continue;
      }

      const makeApiCall = async (): Promise<string> => {
        return api.updatePlaylistTrackPosition({
          playlistId,
          currentPosition: currentTrackIndex,
          newPosition: index === shuffled.length ? index + 1 : index,
          snapshotId: currentSnapshotId,
        });
      };

      try {
        currentSnapshotId = await makeApiCall();
        processedTracks += 1;
        await thunkApi.dispatch(
          setUpdateState({
            processed: processedTracks,
            total: totalTracks,
          })
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 429) {
            const timeout =
              parseInt(err.response.headers["Retry-After"], 10) ?? 5;
            console.log("Backoff timeout");
            await delay(timeout * 1000);
            await makeApiCall();
          }
        }
      }

      currentOrder.splice(currentTrackIndex, 1);
      currentOrder.splice(index, 0, shuffled[index]);
    }

    thunkApi.dispatch(setUpdateState(null));

    return playlistId;
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
    builder.addCase(
      saveShuffledTracks.fulfilled,
      (state, action: PayloadAction<string>) => {
        const playListId = action.payload;
        const tracks = state.playlists[playListId].shuffledTracks;
        state.playlists = {
          ...state.playlists,
          [playListId]: {
            originalTracks: tracks,
            shuffledTracks: tracks,
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
