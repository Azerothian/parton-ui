import React from "react";
import ReactDOM from "react-dom/client";
import ApolloManager from "./managers/apollo";
import { BrowserRouter } from "react-router-dom";
import Page from "./managers/page";
import layout from "./layout";
import sublayout from "./sublayout";
import "./style/index.scss";

function Main() {
  return (
    <ApolloManager>
      <BrowserRouter>
        <Page layouts={layout} components={sublayout} />
      </BrowserRouter>
    </ApolloManager>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
