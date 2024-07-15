import React from "react";
import { PartonUIConfigContext } from "../managers/config";

export function Default404() {
  return <>{"404: Not Found"}</>;
}


export default function FileNotFound(props: any) {
  const partonUIContext = React.useContext(PartonUIConfigContext);
  const Component = partonUIContext.controls.F404;
  return <Component {...props} />;
}