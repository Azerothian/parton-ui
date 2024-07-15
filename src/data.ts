import {
  useQuery as useApolloQuery,
  useMutation as useApolloMutation,
  useLazyQuery as useApolloLazyQuery,
  useApolloClient,
  QueryHookOptions,
  LazyQueryHookOptions,
  MutationFunctionOptions,
  OperationVariables,
  DefaultContext,
  ApolloCache,
} from "@apollo/client";

import { DocumentNode } from "graphql";

// import {AuthStorage} from "../logic/storage";
import {
  cleanDocumentWithJTDMinMeta,
  cleanVariables,
} from "@vostro/clean-gql/lib/jtd-min";
import { usePartonUIConfig } from "./managers/config";
import { IJtdMinRoot } from "@vostro/jtd-types";

// export const CleanGQLContext = createContext();
export interface OptionalDocumentNode extends DocumentNode {
  __cache?: DocumentNode;
  __meta?: any;
}
export interface EnhancedDocumentNode extends DocumentNode {
  __cache: DocumentNode;
  __meta: any;
}

function processDoc(
  query: OptionalDocumentNode,
  jtdSchema: IJtdMinRoot,
): EnhancedDocumentNode {
  if (!query.__cache) {
    const { doc, meta } = cleanDocumentWithJTDMinMeta(query, jtdSchema);
    query.__cache = doc;
    query.__meta = meta;
  }
  return query as EnhancedDocumentNode;
}

export function useMutation(query: DocumentNode) {
  const { jtdSchema } = usePartonUIConfig().graphql;
  if (!jtdSchema) {
    throw new Error("JTD Schema not loaded");
  }
  const q = processDoc(query, jtdSchema);
  const [mutation, mutationData] = useApolloMutation(q.__cache);
  return [
    (
      options:
        | MutationFunctionOptions<
            any,
            OperationVariables,
            DefaultContext,
            ApolloCache<any>
          >
        | undefined,
    ) => {
      const opts: MutationFunctionOptions<
        any,
        OperationVariables,
        DefaultContext,
        ApolloCache<any>
      > = {
        ...options,
      };
      if (options?.variables) {
        opts.variables = cleanVariables(q.__meta, jtdSchema, options.variables);
        console.log("opts", opts, jtdSchema);
      }
      return mutation(opts);
    },
    mutationData,
  ];
}

export function useQuery(query: DocumentNode, options?: QueryHookOptions<any>) {
  const { jtdSchema } = usePartonUIConfig().graphql;
  if (!jtdSchema) {
    throw new Error("JTD Schema not loaded");
  }
  const q = processDoc(query, jtdSchema);
  let variables: any = {};
  if (options?.variables) {
    variables = cleanVariables(q.__meta, jtdSchema, options.variables);
  }
  return useApolloQuery(q.__cache, {
    ...options,
    variables,
  });
}

export function useLazyQuery(
  query: DocumentNode,
  options: LazyQueryHookOptions<any>,
) {
  const { jtdSchema } = usePartonUIConfig().graphql;
  if (!jtdSchema) {
    throw new Error("JTD Schema not loaded");
  }
  const q = processDoc(query, jtdSchema);
  if (!q.__cache) {
    throw new Error("Query was not processed correctly");
  }
  const [func, results] = useApolloLazyQuery(q.__cache, options);
  return [
    (opts: any) => {
      let variables;
      if (opts?.variables) {
        variables = cleanVariables(q.__meta, jtdSchema, opts.variables);
      }
      return func({
        ...opts,
        variables,
      });
    },
    results,
  ];
}
export function useApolloClientQuery() {
  const { jtdSchema } = usePartonUIConfig().graphql;
  if (!jtdSchema) {
    throw new Error("JTD Schema not loaded");
  }

  const apolloClient = useApolloClient();
  return [
    (opts: any) => {
      const q = processDoc(opts.query, jtdSchema);
      let variables;
      if (opts?.variables) {
        variables = cleanVariables(q.__meta, jtdSchema, opts.variables);
      }
      return apolloClient.query({
        ...opts,
        query: q.__cache,
        variables,
      });
    },
  ];
}
