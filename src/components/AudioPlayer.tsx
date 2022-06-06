import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// TODO - Figure out what to do when track finishes playing
function AudioPlayer() {
  const trackUrl = useSelector((state: RootState) => state.audio.url);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    audioRef.current?.pause();
    if (trackUrl) {
      audioRef.current?.play();
    }
  }, [trackUrl]);

  return trackUrl ? (
    <audio className="w-full" ref={audioRef} key={trackUrl}>
      <source src={trackUrl} type="audio/mp3" />
    </audio>
  ) : (
    <div />
  );
}

export default AudioPlayer;
