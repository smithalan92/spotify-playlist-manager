import classNames from "classnames";
import { useState } from "react";

import Tracklist from "./Tracklist";

interface Props {
  originalTracks: Array<SpotifyApi.TrackObjectFull | null>;
  shuffledTracks: Array<SpotifyApi.TrackObjectFull | null>;
}

const TAB_NAMES = {
  ORIGINAL: "original",
  SHUFFLED: "shuffled",
};

function TabbedTrackLists(props: Props) {
  const [selectedTab, setSelectedTab] = useState(TAB_NAMES.SHUFFLED);
  const getTabLinkClasses = (tabName: string) => {
    const isActive = tabName === selectedTab;

    return classNames({
      "relative block p-4 text-sm font-medium": true,
      "bg-white border-t border-l border-r border-gray-200": isActive,
      "text-gray-500 bg-gray-100 ring-1 ring-inset ring-white": !isActive,
    });
  };

  const getTabSpanClasses = (tabName: string) => {
    const isActive = tabName === selectedTab;

    return classNames({
      "absolute inset-x-0 w-full h-px bg-white -bottom-px": isActive,
    });
  };

  return (
    <div className="w-100 mt-4">
      <ul className="flex text-center border-b border-gray-200 w-full">
        <li className="flex-1">
          <a
            className={getTabLinkClasses(TAB_NAMES.ORIGINAL)}
            href="#"
            onClick={() => setSelectedTab(TAB_NAMES.ORIGINAL)}
          >
            <span className={getTabSpanClasses(TAB_NAMES.ORIGINAL)} />
            Original
          </a>
        </li>
        <li className="flex-1 pl-px">
          <a
            className={getTabLinkClasses(TAB_NAMES.SHUFFLED)}
            href="#"
            onClick={() => setSelectedTab(TAB_NAMES.SHUFFLED)}
          >
            <span className={getTabSpanClasses(TAB_NAMES.SHUFFLED)} />
            Shuffled
          </a>
        </li>
      </ul>
      <div className="pt-4 w-full">
        <Tracklist
          tracks={
            selectedTab === TAB_NAMES.ORIGINAL
              ? props.originalTracks
              : props.shuffledTracks
          }
        />
      </div>
    </div>
  );
}

export default TabbedTrackLists;
