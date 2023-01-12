import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "@cloudscape-design/global-styles/index.css";

const rootEl = document.getElementById("root");

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
