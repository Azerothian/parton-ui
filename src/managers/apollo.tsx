import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import React, { useState } from "react";
import config from "../config";

function merge(existing: any, incoming: any) {
  return {
    ...existing,
    ...incoming,
  };
}
const cache = new InMemoryCache({
  typePolicies: {
    QueryClassMethods: {
      merge(existing = {}, incoming) {
        const output = {
          ...existing,
        };
        Object.keys(incoming).forEach((k) => {
          if (existing[k] && k !== "__typename") {
            output[k] = merge(existing[k], incoming[k]);
          } else {
            output[k] = incoming[k];
          }
        });
        return output;
      },
    },
    QueryModels: {
      merge(existing = {}, incoming) {
        return {
          ...existing,
          ...incoming,
        };
      },
    },
    MutationClassMethods: {
      merge(existing = {}, incoming) {
        const output = {
          ...existing,
        };
        Object.keys(incoming).forEach((k) => {
          if (existing[k] && k !== "__typename") {
            output[k] = merge(existing[k], incoming[k]);
          } else {
            output[k] = incoming[k];
          }
        });
        return output;
      },
    },
    MutationModels: {
      merge(existing = {}, incoming) {
        return {
          ...existing,
          ...incoming,
        };
      },
    },
  },
});
let client: ApolloClient<any> | undefined = undefined;
export async function getClient() {
  if (client) {
    return client;
  }
  const api = `${config.api.host}${config.api.endpoint}`;
  client = new ApolloClient({
    // credentials: "include",
    // uri: api,
    link: new BatchHttpLink({
      credentials: "include",
      uri: api,
      batchMax: 20,
      batchInterval: 50,
    }),
    cache: cache,
  });
  return client;
}

export default function ApolloManager(props: any) {
  const [isLoaded, setLoaded] = useState(false);
  if (!isLoaded || !client) {
    (async () => {
      await getClient();
      // logger.debug("loaded client", client);
      return setLoaded(true);
    })();
    return <React.Fragment />;
  }

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
