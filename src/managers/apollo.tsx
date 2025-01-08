import { ApolloClient, ApolloProvider } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import React, { useContext } from "react";
import { PartonUIConfigContext } from "./config";
import { createMemoryCacheFromJTDSchema } from "../apollo/memory-cache";

export default function ApolloManager(props: React.PropsWithChildren<any>) {
  const config = useContext(PartonUIConfigContext);
  let client = undefined;
  if (!client) {
    if (!config.graphql?.jtdSchema) {
      throw new Error("JTD Schema not loaded");
    }
    const cache = createMemoryCacheFromJTDSchema(config.graphql.jtdSchema);
    const link = new BatchHttpLink({
      credentials: config.endpoint.options?.credentials ?? "same-origin",
      headers: config.endpoint.options?.headers as Record<string, string>,
      uri: `${config.endpoint.host}${config.endpoint.path}`,
    });
    client = new ApolloClient({
      cache: cache,
      link: link,
      defaultOptions: {
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
    });
  }

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
