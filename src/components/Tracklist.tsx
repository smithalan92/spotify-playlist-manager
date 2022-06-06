import Track from "../components/Track";

interface Props {
  tracks: Array<SpotifyApi.TrackObjectFull | null>;
}

function Tracklist({ tracks }: Props) {
  return (
    <div>
      {tracks.map((track, index) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return <Track key={track?.id} track={track!} number={index + 1} />;
      })}
    </div>
  );
}

export default Tracklist;
