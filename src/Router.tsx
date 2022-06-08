import { BrowserRouter, Route, Routes } from "react-router-dom";

import App from "./App";
import Login from "./routes/Login";
import Playlist from "./routes/Playlist";
import Playlists from "./routes/Playlists";
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
