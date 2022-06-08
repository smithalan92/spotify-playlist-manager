import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { setAudio } from "../store/slices/audio";
import { RootState } from "../store/store";

// TODO - Figure out what to do when track finishes playing
function AudioPlayer() {
  const trackUrl = useSelector((state: RootState) => state.audio.url);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    audioRef.current?.pause();
    if (trackUrl) {
      audioRef.current?.play();
    }
  }, [trackUrl]);

  const onAudioEnd = () => {
    dispatch(setAudio(null));
  };

  return trackUrl ? (
    <audio
      className="w-full"
      ref={audioRef}
      key={trackUrl}
      onEnded={onAudioEnd}
    >
      <source src={trackUrl} type="audio/mp3" />
    </audio>
  ) : (
    <div />
  );
}

export default AudioPlayer;
