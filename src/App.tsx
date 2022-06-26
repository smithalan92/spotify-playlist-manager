import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "./store/store";
import { selectIsAuthed } from "./store/slices/auth";
import Header from "./components/Header";

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
    <div className="flex flex-col w-full h-full min-w-80 overflow-hidden bg-gray-100">
      <Header />
      <div className="overflow-y-scroll w-full h-full">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
