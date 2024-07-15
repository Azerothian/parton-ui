
/* eslint-disable camelcase */
/* eslint-disable eol-last */
import React from "react";

export default {
  "/components/loader": React.lazy(() => import("./components/loader")),
  "/components/main": React.lazy(() => import("./components/main")),
  "/components/placeholder": React.lazy(() => import("./components/placeholder")),
};
