import React from "react";
import ReactDOM from "react-dom/client";

import { Amplify } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";

import App from "./App";

import '@aws-amplify/ui-react/styles.css';
import "@cloudscape-design/global-styles/index.css";

const rootEl = document.getElementById("root");

let AppEl = App;

// awsResources is populated by aws-resources.js
const awsResources = (global as any).awsResources;
Amplify.configure({
  ...awsResources,
  // Overrides go here
});
AppEl = withAuthenticator(App, {
  hideSignUp: true,
});

if (rootEl != null) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <AppEl />
    </React.StrictMode>,
  );
}
