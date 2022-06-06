import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Playlists from "./routes/Playlists";
import Login from "./routes/Login";
import Playlist from "./routes/Playlist";
import Verify from "./routes/Verify";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="login" element={<Login />} />
          <Route path="playlists" element={<Playlists />} />
          <Route path="verify" element={<Verify />} />
          <Route path="playlist/:id" element={<Playlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
