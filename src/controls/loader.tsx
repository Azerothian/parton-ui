// import React from "react";

import React from "react";
import { PartonUIConfigContext } from "../managers/config";

export function DefaultLoader() {
  return <>{"Loading"}</>;
}


export default function Loader(props: any) {
  const partonUIContext = React.useContext(PartonUIConfigContext);
  const Component = partonUIContext.controls.Loader;
  return <Component {...props} />;
}