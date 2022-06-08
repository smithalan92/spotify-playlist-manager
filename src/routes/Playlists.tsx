import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PlaylistTable from "../components/PlaylistTable";
import { fetchUser } from "../store/slices/auth";
import { fetchPlaylists, setLoading } from "../store/slices/playlist";
import { AppDispatch, RootState } from "../store/store";

function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.playlist.loading);
  const playlists = useSelector((state: RootState) => state.playlist.playlists);

  useEffect(() => {
    if (!playlists.length) {
      dispatch(fetchUser()).then(() => {
        dispatch(fetchPlaylists());
      });
    } else {
      dispatch(setLoading(false));
    }
  }, []);

  const renderLoadingState = () => {
    return <div>Loading...</div>;
  };

  const renderPlaylists = () => {
    return (
      <div className="flex flex-col">
        <PlaylistTable playlists={playlists} />
      </div>
    );
  };

  return <div>{isLoading ? renderLoadingState() : renderPlaylists()}</div>;
}

export default Home;
