import { ApolloClient, ApolloProvider } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { useContext } from "react";
import { PartonUIConfigContext } from "./config";
import { createBasicMemoryCache, createMemoryCacheFromJTDSchema } from "../apollo/memory-cache";


export default function ApolloManager(props: any) {
  const config = useContext(PartonUIConfigContext);
  let client = config.graphql?.apolloClient;
  if (!client) {
    const {cache, link, defaultOptions, ...apolloConfig} = config.graphql?.apolloConfig || {};
    client = new ApolloClient({
      cache: config.graphql?.jtdSchema ? createMemoryCacheFromJTDSchema(config.graphql.jtdSchema) : createBasicMemoryCache(),
      link: link ? link: new BatchHttpLink({
        credentials: "include",
        uri: `${config.endpoint.host}${config.endpoint.path}`,
      }),
      defaultOptions: defaultOptions ? defaultOptions : {
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
