import React, { useEffect } from "react";
import { Default404 } from "../controls/f404";
import { DefaultLoader } from "../controls/loader";
import {
  ApolloClient,
  ApolloClientOptions,
  NormalizedCacheObject,
} from "@apollo/client";
import { IJtdMinRoot } from "@vostro/jtd-types";
export type LayoutCollection = Record<
  string,
  React.ComponentType | React.LazyExoticComponent<any>
>;

export interface PartonUIConfigGraphQL {
  // loadJtd: boolean;
  jtdSchema: IJtdMinRoot | undefined;
  apolloClient: ApolloClient<any> | undefined;
  apolloConfig: ApolloClientOptions<NormalizedCacheObject> | undefined;
}

export interface PartonUIConfig {
  endpoint: {
    host: string; // /
    path: string; // graphql.api
    jdtPath: string; // jtd.api
    options?: RequestInit;
  };
  controls: {
    F404: React.ComponentType;
    Loader: React.ComponentType;
  };
  sublayouts: LayoutCollection;
  layouts: LayoutCollection;
  graphql: PartonUIConfigGraphQL;
}

export const configDefaults: PartonUIConfig = {
  endpoint: {
    host: "/",
    path: "graphql.api",
    jdtPath: "graphql.jdt",
  },
  sublayouts: {},
  layouts: {},
  controls: {
    F404: Default404,
    Loader: DefaultLoader,
  },

  graphql: {
    // loadJtd: true,
    jtdSchema: undefined,
    apolloClient: undefined,
    apolloConfig: undefined,
  },
};

export const PartonUIConfigContext =
  React.createContext<PartonUIConfig>(configDefaults);
export const PartonUIProvider = PartonUIConfigContext.Provider;
export const PartonUIConsumer = PartonUIConfigContext.Consumer;

export interface PartonUIConfigManagerProps {
  config: PartonUIConfig;
  children: any;
}
export default function PartonUIConfigManager(
  props: PartonUIConfigManagerProps,
) {
  const config = { ...configDefaults, ...props.config };
  const [jdtSchema, setJdtSchema] = React.useState<IJtdMinRoot | undefined>(
    props.config.graphql.jtdSchema,
  );
  useEffect(() => {
    void fetch(
      `${config.endpoint.host}${config.endpoint.jdtPath}`,
      config.endpoint.options,
    )
      .then((response) => response.json())
      .then((data: IJtdMinRoot | undefined) => {
        setJdtSchema(data);
      });
  }, [config.endpoint.host, config.endpoint.jdtPath, config.endpoint.options]);
  const { Loader } = config.controls;
  if (!jdtSchema) {
    return <Loader />;
  }
  const configWithJtd: PartonUIConfig = {
    ...config,
    graphql: {
      ...config.graphql,
      jtdSchema: jdtSchema,
    },
  };
  return (
    <PartonUIProvider value={configWithJtd}>{props.children}</PartonUIProvider>
  );
}

export function usePartonUIConfig() {
  return React.useContext(PartonUIConfigContext);
}
