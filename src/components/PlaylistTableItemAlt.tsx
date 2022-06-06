import { Link } from "react-router-dom";
import { Playlist } from "../types";

function PlaylistTableItemAlt({ playlist }: { playlist: Playlist }) {
  return (
    <Link
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
}

export default PlaylistTableItemAlt;
