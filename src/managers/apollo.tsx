import { ApolloClient, ApolloProvider } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import React, { useContext } from "react";
import { PartonUIConfigContext } from "./config";
import { createMemoryCacheFromJTDSchema } from "../apollo/memory-cache";

export default function ApolloManager(props: React.PropsWithChildren<any>) {
  const config = useContext(PartonUIConfigContext);
  let client = config.graphql?.apolloClient;
  if (!client) {
    if (!config.graphql?.jtdSchema) {
      throw new Error("JTD Schema not loaded");
    }
    const { cache, link, defaultOptions, ...apolloConfig } =
      config.graphql?.apolloConfig ?? {};
    client = new ApolloClient({
      cache: cache
        ? cache
        : createMemoryCacheFromJTDSchema(config.graphql.jtdSchema),
      link: link
        ? link
        : new BatchHttpLink({
            credentials: config.endpoint.options?.credentials ?? "same-origin",
            headers: config.endpoint.options?.headers as Record<string, string>,
            uri: `${config.endpoint.host}${config.endpoint.path}`,
          }),
      defaultOptions: defaultOptions
        ? defaultOptions
        : {
            watchQuery: {
              fetchPolicy: "cache-and-network",
              errorPolicy: "ignore",
            },
            query: {
              fetchPolicy: "cache-first",
              errorPolicy: "all",
            },
            mutate: {
              errorPolicy: "all",
            },
          },
      ...apolloConfig,
    });
  }

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
