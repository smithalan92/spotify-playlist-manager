import { Playlist } from "../types";
import PlaylistTableItem from "./PlaylistTableItemAlt";

function PlaylistTable({ playlists }: { playlists: Playlist[] }) {
  return (
    <div className="mt-6 flex flex-wrap justify-center">
      {playlists.map((playlist) => {
        return <PlaylistTableItem key={playlist.id} playlist={playlist} />;
      })}
    </div>
  );
}

export default PlaylistTable;
