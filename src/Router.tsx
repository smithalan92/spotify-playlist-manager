import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Playlist from "./routes/Playlist";
import Verify from "./routes/Verify";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="login" element={<Login />} />
          <Route path="home" element={<Home />} />
          <Route path="verify" element={<Verify />} />
          <Route path="playlist/:id" element={<Playlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
