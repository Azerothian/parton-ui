import {
  useQuery as useTSQuery,
  useMutation as useTSMutation,
  UseMutationOptions,
  DefaultError,
  UseQueryOptions,
} from "@tanstack/react-query";

import { DocumentNode } from "graphql";

// import {AuthStorage} from "../logic/storage";
import {
  cleanDocumentWithJTDMinMeta,
  cleanVariables,
} from "@vostro/clean-gql/lib/jtd-min";
import { usePartonUIConfig } from "./managers/config";
import { IJtdMinRoot } from "@azerothian/jtd-types";
import request from "graphql-request";

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

export function useMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  query: DocumentNode,
  options?: UseMutationOptions<TData, TError, TVariables, TContext>,
) {
  const config = usePartonUIConfig();
  const { jtdSchema } = config.graphql;
  if (!jtdSchema) {
    throw new Error("JTD Schema not loaded");
  }
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const q = processDoc(query, jtdSchema);
  return useTSMutation({
    mutationKey: ["mutation"],
    mutationFn: async (variables: any): Promise<TData> => {
      if (!q.__cache) {
        throw new Error("Query was not processed correctly");
      }
      const cleanedVariables = cleanVariables(q.__meta, jtdSchema, variables);
      return request(
        `${config.endpoint.host}${config.endpoint.path}`,
        q.__cache,
        cleanedVariables,
        headers,
      );
    },
    ...options,
  });
}

export function useQuery<TQueryFnData = unknown, TData = TQueryFnData>(
  query: DocumentNode,
  variables?: any,
  options?: UseQueryOptions<TData, Error, TData, string[]>,
) {
  const config = usePartonUIConfig();
  const { jtdSchema } = config.graphql;
  if (!jtdSchema) {
    throw new Error("JTD Schema not loaded");
  }
  const q = processDoc(query, jtdSchema);
  let cleanVariables: any = {};
  if (variables) {
    cleanVariables = cleanVariables(q.__meta, jtdSchema, variables);
  }
  return useTSQuery({
    queryKey: ["query"],
    queryFn: async (): Promise<TData> => {
      if (!q.__cache) {
        throw new Error("Query was not processed correctly");
      }
      return request(
        `${q.__meta.host}${q.__meta.path}`,
        q.__cache,
        cleanVariables,
      );
    },
    ...options,
  });
}

// export function useLazyQuery(
//   query: DocumentNode,
//   options: LazyQueryHookOptions<any>,
// ) {
//   const { jtdSchema } = usePartonUIConfig().graphql;
//   if (!jtdSchema) {
//     throw new Error("JTD Schema not loaded");
//   }
//   const q = processDoc(query, jtdSchema);
//   if (!q.__cache) {
//     throw new Error("Query was not processed correctly");
//   }
//   const [func, results] = useApolloLazyQuery(q.__cache, options);
//   return [
//     (opts: any) => {
//       let variables;
//       if (opts?.variables) {
//         variables = cleanVariables(q.__meta, jtdSchema, opts.variables);
//       }
//       return func({
//         ...opts,
//         variables,
//       });
//     },
//     results,
//   ];
// }
// export function useApolloClientQuery() {
//   const { jtdSchema } = usePartonUIConfig().graphql;
//   if (!jtdSchema) {
//     throw new Error("JTD Schema not loaded");
//   }

//   const apolloClient = useApolloClient();
//   return [
//     (opts: any) => {
//       const q = processDoc(opts.query, jtdSchema);
//       let variables;
//       if (opts?.variables) {
//         variables = cleanVariables(q.__meta, jtdSchema, opts.variables);
//       }
//       return apolloClient.query({
//         ...opts,
//         query: q.__cache,
//         variables,
//       });
//     },
//   ];
// }
