import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import api from "../api";
import AudioPlayer from "../components/AudioPlayer";
import Track from "../components/Track";
import Tracklist from "../components/Tracklist";
import { RootState } from "../store/store";

function Playlist() {
  const { id: playlistId } = useParams<{ id: string }>();
  const playlist = useSelector((state: RootState) => {
    return state.playlist.playlists.find(
      (playlist) => playlist.id === playlistId
    );
  });

  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState<
    Array<SpotifyApi.TrackObjectFull | null>
  >([]);

  useEffect(() => {
    const loadTracks = async () => {
      const tracks = await api.getPlaylistTracks(playlistId);
      setTracks(tracks);
      setIsLoading(false);
    };
    loadTracks();
  }, []);

  function renderLoadingState() {
    return <span className="font-bold text-xl">Loading...</span>;
  }

  function renderTracks() {
    return (
      <div>
        <Tracklist tracks={tracks} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-center">
      {isLoading ? renderLoadingState() : renderTracks()}
      <div className="absolute bottom-0">
        <AudioPlayer />
      </div>
    </div>
  );
}

export default Playlist;
