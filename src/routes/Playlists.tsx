import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PlaylistTable from "../components/PlaylistTable";
import { fetchUser } from "../store/slices/auth";
import { fetchPlaylists, setLoading } from "../store/slices/playlist";
import { AppDispatch, RootState } from "../store/store";
import { ReactComponent as Spinner } from "../assets/spinner.svg";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.playlist.loading);
  const playlists = useSelector((state: RootState) => state.playlist.playlists);

  useEffect(() => {
    // TODO - Always update playlists
    if (!playlists.length) {
      dispatch(fetchUser()).then(() => {
        dispatch(fetchPlaylists());
      });
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  const renderLoadingState = () => {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="w-16 stroke-spotify-green" />
      </div>
    );
  };

  const renderPlaylists = () => {
    return (
      <div className="flex flex-col">
        <PlaylistTable playlists={playlists} />
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
