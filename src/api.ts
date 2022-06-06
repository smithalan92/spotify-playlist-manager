/// <reference types="spotify-api" />

import axios from "axios";
import { API_URL, SPOTIFY_API_URL } from "./constants";
import { store } from "./store/store";
import { Playlist, User } from "./types";

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
): Promise<Array<SpotifyApi.TrackObjectFull | null>> {
  const auth = getAuthHeader();

  let offset = 0;
  let hasMore = true;
  let tracks: Array<SpotifyApi.TrackObjectFull | null> = [];

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

    tracks = [
      ...tracks,
      ...data.items
        .filter((track) => !track.is_local)
        .map((track) => track.track),
    ];

    if (data.next !== null) {
      offset += tracks.length;
    } else {
      hasMore = false;
    }
  }

  return tracks;
}

export default {
  getToken,
  getPlaylists,
  getUserProfile,
  getPlaylistTracks,
};
