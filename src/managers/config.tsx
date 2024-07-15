import React from "react";
import { Default404 } from "../controls/f404";
import { DefaultLoader } from "../controls/loader";
import {
  ApolloClient,
  ApolloClientOptions,
  NormalizedCacheObject,
} from "@apollo/client";
import { IJtdMinRoot } from "@vostro/jtd-types";
export interface LayoutCollection {
  [key: string]: React.ComponentType;
}
export interface PartonUIConfigGraphQL {
  jtdSchema: IJtdMinRoot;
  apolloClient: ApolloClient<any> | undefined;
  apolloConfig: ApolloClientOptions<NormalizedCacheObject> | undefined;
}

export interface PartonUIConfig {
  endpoint: {
    host: string; // /
    path: string; // graphql.api
  };
  controls: {
    F404: React.ComponentType;
    Loader: React.ComponentType;
  };
  components: LayoutCollection;
  layouts: LayoutCollection;
  graphql: PartonUIConfigGraphQL;
}

export const PartonUIConfigContext = React.createContext<PartonUIConfig>({
  endpoint: {
    host: "/",
    path: "graphql.api",
  },
  components: {},
  layouts: {},
  controls: {
    F404: Default404,
    Loader: DefaultLoader,
  },
  graphql: {
    jtdSchema: {},
    apolloClient: undefined,
    apolloConfig: undefined,
  },
});
export const PartonUIProvider = PartonUIConfigContext.Provider;
export const PartonUIConsumer = PartonUIConfigContext.Consumer;

export default function PartonUIConfigManager(props: {
  config: PartonUIConfig;
  children: any;
}) {
  return (
    <PartonUIProvider value={props.config}>{props.children}</PartonUIProvider>
  );
}

export function usePartonUIConfig() {
  return React.useContext(PartonUIConfigContext);
}
