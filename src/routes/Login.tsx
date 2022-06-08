/// <reference types="vite-plugin-svgr/client" />
import { useDispatch } from "react-redux";
import * as uuid from "uuid";

import { ReactComponent as SpotifyLogo } from "../assets/spotify-logo.svg";
import { API_URL } from "../constants";
import { setStateKey } from "../store/slices/auth";

function Login() {
  const dispatch = useDispatch();

  const login = () => {
    const stateKey = uuid.v4();
    dispatch(setStateKey(stateKey));
    window.location.href = `${API_URL}login/${stateKey}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative">
        <SpotifyLogo className="w-96 pb-1" />
        <div className="absolute bottom-0 right-0 text-spotify-green font-bold">
          Playlist manager
        </div>
      </div>
      <div className="mt-24">
        <button
          type="button"
          onClick={login}
          className="focus:outline-none text-white bg-spotify-green hover:bg-green-400 font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        >
          Login to Spotify
        </button>
      </div>
    </div>
  );
}

export default Login;
