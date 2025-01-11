import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Equipment from "./components/Equipment";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <Equipment />
  </React.StrictMode>,
  document.getElementById("root")
);

// PWA Service Worker 등록
serviceWorkerRegistration.register();
