import { useEffect } from "react";
import { Link } from "react-router-dom";

import { fetchUser } from "../store/slices/auth";
import {
  fetchPlaylists,
  getIsLoading,
  getPlaylists,
} from "../store/slices/playlist";
import { useAppDispatch } from "../store/store";
import { ReactComponent as Spinner } from "../assets/spinner.svg";
import { Playlist } from "../types";

function Home() {
  const dispatch = useAppDispatch();
  const isLoading = getIsLoading();
  const playlists = getPlaylists();

  useEffect(() => {
    dispatch(fetchUser()).then(() => {
      dispatch(fetchPlaylists());
    });
  }, []);

  const renderLoadingState = () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="w-16 stroke-spotify-green" />
      </div>
    );
  };

  const renderPlaylists = () => {
    const renderPlaylist = (playlist: Playlist) => {
      return (
        <Link
          key={playlist.id}
          to={`/playlist/${playlist.id}`}
          className={`relative block overflow-hidden bg-center bg-no-repeat bg-cover rounded-xl w-56 h-56 m-2`}
          style={{ backgroundImage: `url(${playlist.image.url})` }}
        >
          <div className="p-4 absolute bottom-0 text-white bg-black bg-opacity-70 w-full text-center">
            <h5 className="text-md font-bold line-clamp-1">{playlist.name}</h5>
            <p className="text-xs">Tracks: {playlist.trackCount}</p>
          </div>
        </Link>
      );
    };

    return (
      <div className="flex mt-6 flex-wrap justify-center">
        {playlists.map((playlist) => renderPlaylist(playlist))}
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {isLoading ? renderLoadingState() : renderPlaylists()}
    </div>
  );
}

export default Home;
