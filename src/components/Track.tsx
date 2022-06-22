import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as PauseIcon } from "../assets/pause-icon.svg";
import { ReactComponent as PlayIcon } from "../assets/play-icon.svg";
import { setAudio } from "../store/slices/audio";
import { RootState } from "../store/store";

interface Props {
  track: SpotifyApi.TrackObjectFull;
  number: number;
}

function Track({ track, number }: Props) {
  const dispatch = useDispatch();
  const isTrackPlaying = useSelector(
    (state: RootState) => state.audio.url === track.preview_url
  );

  const toggleAudio = () => {
    if (isTrackPlaying) {
      dispatch(setAudio(null));
    } else {
      dispatch(setAudio(track.preview_url));
    }
  };

  function renderPlayControls() {
    if (!track.preview_url) {
      return <span />;
    }

    return (
      <div
        className="ml-4 px-2 bg-gray-200 h-8 w-8 rounded flex items-center justify-center cursor-pointer"
        onClick={toggleAudio}
      >
        {isTrackPlaying ? (
          <PauseIcon className="w-2" />
        ) : (
          <PlayIcon className="w-2" />
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center px-2 py-1 text-xs w-full">
      <div className="relative w-11">
        <div className="h-11">
          <img src={track.album.images[0].url} className="w-11" />
        </div>
        <span className="absolute left-0 bottom-0 w-10 text-white text-xs bg-black/40 w-11">
          #{number}
        </span>
      </div>
      <div className="flex flex-col ml-1 flex-1">
        <span className="line-clamp-1">{track?.name}</span>
        <span className="line-clamp-1">{track?.artists[0].name}</span>
      </div>
      {renderPlayControls()}
    </div>
  );
}

export default Track;
