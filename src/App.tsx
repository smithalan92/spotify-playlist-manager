import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ReactComponent as AppIcon } from "./assets/app-icon.svg";
import { useAppSelector } from "./store/store";
import { selectIsAuthed } from "./store/slices/auth";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthed = useAppSelector(selectIsAuthed);

  useEffect(() => {
    if (!isAuthed && !["/login", "/verify"].includes(location.pathname)) {
      navigate("/login");
    } else if (location.pathname === "/") {
      navigate("/playlists");
    }
  }, [location]);

  return (
    <div className="flex flex-col w-full h-full min-w-100 overflow-hidden bg-gray-100">
      <div className="w-full flex p-2 items-center justify-center bg-gray-800 border-b-4 border-solid border-gray-900">
        <div className="flex p-2 items-center">
          <span className="text-xl text-center text-white mr-2">
            Spotify Playlist Manager
          </span>
          <AppIcon className="w-8 transform rotate-90" />
        </div>
      </div>
      <div className="overflow-y-scroll w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
