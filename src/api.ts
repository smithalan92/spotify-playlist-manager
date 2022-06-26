/// <reference types="spotify-api" />

import Axios, { AxiosError } from "axios";

import { API_URL, SPOTIFY_API_URL } from "./constants";
import { setToken } from "./store/slices/auth";
import { store } from "./store/store";
import { User } from "./types";

const axios = Axios.create();

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error: AxiosError) {
    if (error.response?.status === 401) {
      store.dispatch(setToken(""));
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const getAuthHeader = () => {
  const state = store.getState();
  const token = state.auth.token;

  return {
    Authorization: `Bearer ${token}`,
  };
};

async function getToken(code: string): Promise<string> {
  const { data } = await axios.post(`${API_URL}auth/token`, {
    code,
  });

  return data.token;
}

async function getUserProfile(): Promise<User> {
  const auth = getAuthHeader();

  const { data } = await axios.get(`${SPOTIFY_API_URL}me`, {
    headers: {
      ...auth,
    },
  });

  return {
    id: data.id,
    name: data.display_name,
  };
}

async function getPlaylists(): Promise<
  Array<SpotifyApi.PlaylistObjectSimplified>
> {
  const auth = getAuthHeader();
  let offset = 0;
  let hasMore = true;
  let playlists: Array<SpotifyApi.PlaylistObjectSimplified> = [];

  while (hasMore) {
    const { data }: { data: SpotifyApi.ListOfCurrentUsersPlaylistsResponse } =
      await axios.get(`${SPOTIFY_API_URL}me/playlists`, {
        params: {
          limit: 50,
          offset,
        },
        headers: {
          ...auth,
        },
      });

    playlists = [...playlists, ...data.items];

    if (data.next !== null) {
      offset += playlists.length;
    } else {
      hasMore = false;
    }
  }

  return playlists;
}

async function getPlaylistTracks(
  id: string | undefined
): Promise<Array<SpotifyApi.TrackObjectFull>> {
  const auth = getAuthHeader();

  let offset = 0;
  let hasMore = true;
  let tracks: Array<SpotifyApi.TrackObjectFull> = [];

  while (hasMore) {
    const { data }: { data: SpotifyApi.PlaylistTrackResponse } =
      await axios.get(`${SPOTIFY_API_URL}playlists/${id}/tracks`, {
        params: {
          limit: 50,
          offset,
        },
        headers: {
          ...auth,
        },
      });

    tracks = [...tracks, ...data.items.map(({ track }) => track!)];

    if (data.next !== null) {
      offset += tracks.length;
    } else {
      hasMore = false;
    }
  }

  return tracks;
}

async function updatePlaylistTrackPosition({
  playlistId,
  currentPosition,
  newPosition,
  snapshotId,
}: {
  playlistId: string;
  currentPosition: number;
  newPosition: number;
  snapshotId: string;
}) {
  const auth = getAuthHeader();

  const payload: {
    range_start: number;
    insert_before: number;
    snapshot_id: string;
    range_length: 1;
  } = {
    range_start: currentPosition,
    insert_before: newPosition,
    snapshot_id: snapshotId,
    range_length: 1,
  };

  const { data } = await axios.put(
    `${SPOTIFY_API_URL}playlists/${playlistId}/tracks`,
    payload,
    { headers: { ...auth } }
  );

  return data.snapshot_id;
}

export default {
  getToken,
  getPlaylists,
  getUserProfile,
  getPlaylistTracks,
  updatePlaylistTrackPosition,
};
