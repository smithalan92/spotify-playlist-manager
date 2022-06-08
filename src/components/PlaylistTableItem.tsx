import { Link } from "react-router-dom";

import { Playlist } from "../types";

function PlaylistTableItem({ playlist }: { playlist: Playlist }) {
  return (
    <div className="relative flex flex-col mb-3 items-center rounded-sm bg-gray-700 mx-2 shadow-sm w-80 p-1 select-none text-white">
      <div className="w-full flex bg-gray-800 p-2">
        <img src={playlist.image.url} width={120} />
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <span className="flex font-bold">{playlist.name}</span>
          <span className="mt-2">Tracks: {playlist.trackCount}</span>
        </div>
      </div>
      <div className="w-full flex bg-gray-800 hover:bg-gray-700 p-2 border-t-2 border-solid border-gray-500">
        <div className="flex flex-col items-center justify-center text-center flex-1">
          <Link className="w-full" to={`/playlist/${playlist.id}`}>
            Shuffle
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PlaylistTableItem;
