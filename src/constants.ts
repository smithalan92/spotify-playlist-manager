export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3420/"
    : "https://spotify-api.smithy.dev/";

export const SPOTIFY_API_URL = "https://api.spotify.com/v1/";
