import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "react-use";

import api from "../api";
import AudioPlayer from "../components/AudioPlayer";
import TabbedTrackLists from "../components/TabbedTrackLists";
import Tracklist from "../components/Tracklist";
import { RootState } from "../store/store";
import { saveShuffledPlaylist, shuffleArray } from "../utils";

function Playlist() {
  const navigate = useNavigate();
  const { id: playlistId } = useParams<{ id: string }>();
  const playlist = useSelector((state: RootState) => {
    return state.playlist.playlists.find(
      (playlist) => playlist.id === playlistId
    );
  });

  const [isLoading, setIsLoading] = useState(true);
  const [originalTracks, setOrigialTracks] = useState<
    Array<SpotifyApi.TrackObjectFull | null>
  >([]);
  const [shuffledTracks, setShuffledTracks] = useState<
    Array<SpotifyApi.TrackObjectFull | null>
  >([]);

  const { width } = useWindowSize();

  useEffect(() => {
    const loadTracks = async () => {
      const tracks = await api.getPlaylistTracks(playlistId);
      setOrigialTracks(tracks);
      setShuffledTracks(
        shuffleArray<SpotifyApi.TrackObjectFull | null>(tracks)
      );
      setIsLoading(false);
    };
    loadTracks();
  }, []);

  const shuffleTracks = () => {
    setShuffledTracks(
      shuffleArray<SpotifyApi.TrackObjectFull | null>(shuffledTracks)
    );
  };

  const onClickSave = async () => {
    const originalOrder = originalTracks!.map((track) => track!.uri);
    const shuffledOrder = shuffledTracks!.map((track) => track!.uri);
    await saveShuffledPlaylist(originalOrder, shuffledOrder, playlist!.id);
  };

  function goToPlaylists() {
    navigate("/playlists");
  }

  function renderLoadingState() {
    return <span className="font-bold text-xl">Loading...</span>;
  }

  function renderSideBySideTracks() {
    return (
      <div className="flex">
        <div className="flex flex-col">
          <span className="text-lg mb-4 text-center">Original Order</span>
          <Tracklist tracks={originalTracks} />
        </div>
        <div className="flex flex-col">
          <span className="text-lg mb-4 text-center">Shuffled Order</span>
          <Tracklist tracks={shuffledTracks} />
        </div>
      </div>
    );
  }

  function renderTabbedTracks() {
    return (
      <TabbedTrackLists
        originalTracks={originalTracks}
        shuffledTracks={shuffledTracks}
      />
    );
  }

  function renderTracks() {
    if (width > 825) return renderSideBySideTracks();
    return renderTabbedTracks();
  }

  return (
    <div className="flex flex-col w-full h-full items-center">
      <span className="font-bold text-lg">{playlist?.name} Playlist</span>
      {isLoading ? renderLoadingState() : renderTracks()}
      <div className="flex justify-center mt-8">
        <button
          className="inline-block px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-green-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
          onClick={goToPlaylists}
        >
          Back
        </button>
        <button
          className="ml-2 inline-block px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-green-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
          onClick={shuffleTracks}
        >
          Shuffle
        </button>
        <button
          className="ml-2 inline-block px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-green-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
          onClick={onClickSave}
        >
          Save
        </button>
      </div>
      <div className="absolute bottom-0">
        <AudioPlayer />
      </div>
    </div>
  );
}

export default Playlist;
