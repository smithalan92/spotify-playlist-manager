/// <reference types="vite-plugin-svgr/client" />

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import { store } from "./store/store";
import Router from "./Router";
import "./styles/index.css";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router />
  </Provider>
  // </React.StrictMode>
);
