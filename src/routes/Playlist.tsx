import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useWindowSize } from "react-use";

import api from "../api";
import AudioPlayer from "../components/AudioPlayer";
import TabbedTrackLists from "../components/TabbedTrackLists";
import Tracklist from "../components/Tracklist";
import LoadingOverlay from "../components/LoadingOverlay";
import { RootState, useAppSelector } from "../store/store";
import { saveShuffledPlaylist, shuffleArray } from "../utils";
import { ReactComponent as Spinner } from "../assets/spinner.svg";
import { setAudio } from "../store/slices/audio";
import { selectTrackUpdateState } from "../store/slices/tracks";

function Playlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const trackUpdateState = useAppSelector(selectTrackUpdateState);

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

  useEffect(() => {
    return () => {
      dispatch(setAudio(null));
    };
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
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner className="w-16 stroke-spotify-green" />
      </div>
    );
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

  function renderTrackUpdateView() {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-100 bg-spotify-green/50">Updating</div>
        </div>
      </div>
    );
  }

  function renderContent() {
    return (
      <div className="flex flex-col items-center">
        {width > 825 ? renderSideBySideTracks() : renderTabbedTracks()}
        <div className="flex justify-center mt-8 flex-wrap">
          <button
            className="mt-1 inline-block px-12 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-green-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
            onClick={goToPlaylists}
          >
            Back
          </button>
          <button
            className="mt-1 ml-2 inline-block px-12 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-green-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
            onClick={shuffleTracks}
          >
            Shuffle
          </button>
          <button
            className="mt-1 ml-2 inline-block px-12 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-green-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
            onClick={onClickSave}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  const maybeRenderLoadingOverlay = () => {
    if (trackUpdateState.total > 0) {
      const message = `Shuffled ${trackUpdateState.processed} / ${trackUpdateState.total} tracks`;
      return <LoadingOverlay message={message} />;
    }
    return <></>;
  };

  return (
    <div className="flex flex-col w-full h-full items-center">
      {maybeRenderLoadingOverlay()}
      <span className="font-bold text-lg">{playlist?.name} Playlist</span>
      <span className="text-sm">{originalTracks.length} tracks</span>
      {isLoading ? renderLoadingState() : renderContent()}
      <div className="absolute bottom-0">
        <AudioPlayer />
      </div>
    </div>
  );
}

export default Playlist;
