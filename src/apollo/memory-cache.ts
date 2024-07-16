import { InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import type { IJtdMinRoot } from "@vostro/jtd-types";

function merge(existing: any, incoming: any) {
  return {
    ...existing,
    ...incoming,
  };
}

// Potentially (probably) buggy....
export function createBasicMemoryCache() {
  return new InMemoryCache({
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
}

export function createMemoryCacheFromJTDSchema(jtdSchema: IJtdMinRoot) {
  if (!jtdSchema?.def) {
    throw new Error("Invalid JTD Schema");
  }

  const relayPage = relayStylePagination(() => {
    return ["where", "include"];
  });
  const cacheSettings = {
    typePolicies: {
      QueryClassMethods: {
        merge(existing: any = {}, incoming: any) {
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
        merge(existing: any = {}, incoming: any) {
          const outgoing = {
            ...existing,
            ...incoming,
          };
          return outgoing;
        },
        fields: Object.keys(jtdSchema.def.QueryModels?.p ?? []).reduce(
          (o, keyName) => {
            // added a lot of null checks here, not sure on performance hit? (had to for typescript)
            const listRef = jtdSchema?.def?.QueryModels?.p?.[keyName]?.ref;
            if (!listRef) {
              throw new Error(
                `Invalid JTD Schema - could not find list reference for ${keyName}`,
              );
            }

            const edgesRef = jtdSchema.def?.[listRef].p?.edges?.el?.ref;
            if (!edgesRef) {
              throw new Error(
                `Invalid JTD Schema - could not find edges reference for ${keyName} - ${listRef}`,
              );
            }
            const nodeRef = jtdSchema.def?.[edgesRef]?.p?.node?.ref;
            if (!nodeRef) {
              throw new Error(
                `Invalid JTD Schema - could not find node reference for ${keyName} - ${edgesRef}`,
              );
            }
            const nodeProperties = jtdSchema.def?.[nodeRef]?.p ?? {};
            if (!nodeProperties) {
              throw new Error(
                `Invalid JTD Schema - could not find node reference for ${keyName} - ${nodeRef}`,
              );
            }
            o[keyName] = {
              ...relayPage,
              fields: {
                edges: {
                  node: {
                    ...Object.keys(nodeProperties)
                      .map((fieldName) => {
                        const e = nodeProperties[fieldName];
                        if (e.ref) {
                          const targetEl = jtdSchema.def?.[e.ref];
                          if (targetEl?.p?.edges) {
                            return relayPage;
                          }
                        }
                        return undefined;
                      })
                      .filter((s) => !s),
                  },
                },
              },
            };
            return o;
          },
          {} as any,
        ),
      },
      MutationClassMethods: {
        merge(existing: any = {}, incoming: any) {
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
        merge(existing: any = {}, incoming: any) {
          return {
            ...existing,
            ...incoming,
          };
        },
      },
    },
  };
  // console.log("cacheSettings", cacheSettings);
  return new InMemoryCache(cacheSettings);
}
