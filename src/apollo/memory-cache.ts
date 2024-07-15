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
        fields: Object.keys(jtdSchema.def.QueryModels?.p || []).reduce(
          (o, keyName) => {
            // added a lot of null checks here, not sure on performance hit? (had to for typescript)

            if (
              !jtdSchema?.def ||
              !jtdSchema.def?.QueryModels?.p ||
              !jtdSchema.def.QueryModels.p[keyName].ref
            ) {
              throw new Error("Invalid JTD Schema");
            }

            const listDef =
              jtdSchema.def[jtdSchema.def.QueryModels.p[keyName].ref];
            if (!listDef.p?.edges?.el?.ref) {
              throw new Error("Invalid JTD Schema");
            }
            const edgesDef = jtdSchema.def[listDef.p.edges.el.ref];
            if (!edgesDef.p?.node.ref) {
              throw new Error("Invalid JTD Schema");
            }
            const nodeDef = jtdSchema.def[edgesDef.p.node.ref];
            if (!nodeDef.p) {
              throw new Error("Invalid JTD Schema");
            }
            o[keyName] = {
              ...relayPage,
              fields: {
                edges: {
                  node: {
                    ...Object.keys(nodeDef.p)
                      .map((fieldName) => {
                        if (!nodeDef.p || !jtdSchema?.def) {
                          throw new Error("Invalid JTD Schema");
                        }
                        const e = nodeDef.p[fieldName];
                        if (e.ref) {
                          const targetEl = jtdSchema.def[e.ref];
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
