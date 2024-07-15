import { BrowserRouter } from "react-router-dom";
import ApolloManager from "./apollo";
import Page from "./page";
import PartonUIConfigManager, { PartonUIConfig } from "./config";

export default function BaseManager(props: {config: PartonUIConfig}) {
  return (
    <PartonUIConfigManager config={props.config}>
      <ApolloManager>
        <BrowserRouter>
          <Page />
        </BrowserRouter>
      </ApolloManager>
    </PartonUIConfigManager>
  );
}
