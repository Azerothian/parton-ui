import { BrowserRouter } from "react-router-dom";
import Page from "./page";
import PartonUIConfigManager, { PartonUIConfig } from "./config";

export default function BaseManager(props: { config: PartonUIConfig }) {
  return (
    <PartonUIConfigManager config={props.config}>
      <BrowserRouter>
        <Page />
      </BrowserRouter>
    </PartonUIConfigManager>
  );
}
