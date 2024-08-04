// import { gql } from "@apollo/client";
import React, { Suspense, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PartonUIConfigContext } from "./config";
import { useQuery } from "../data";
import { getPageQuery, getPageQueryResult } from "../logic/page";
// export interface PageProps {}

export const PageContext = React.createContext({
  page: undefined,
});
export const PageProvider = PageContext.Provider;
export const PageConsumer = PageContext.Consumer;

// export const getPageQuery = gql`
//   query getPage($uri: String!) {
//     getPage(uri: $uri) {
//       id
//       name
//       displayName
//       values
//       webPath
//       props
//       layout {
//         id
//         path
//         props
//       }
//       sublayouts {
//         id
//         path
//         props
//       }
//     }
//   }
// `;
// export const getPageQueryOptions = {
//   props(info: any) {
//     const { ownProps, data } = info;
//     const { loading, getPage } = data;
//     if (loading) {
//       return Object.assign({}, ownProps, { loading });
//     }
//     return Object.assign({}, ownProps, { page: getPage });
//   },
// };

// export function getPageQueryResult(result: any) {
//   let data = result.data;
//   if (!data) {
//     data = result.previousData;
//   }
//   return data?.getPage;
// }

export default function Page() {
  const location = useLocation();
  const u = new URL(window.location.toString());
  const p = `${u.protocol}//${u.host}${location.pathname}`;
  const result = useQuery(getPageQuery, {
    // ...getPageQueryOptions,
    variables: { uri: p },
  });
  const { loading, error } = result;

  const page = getPageQueryResult(result);
  useEffect(() => {
    // todo - expose to config hook? or props on page;
    document.title = `${page?.displayName || ""}`;
  }, [page]);

  const config = useContext(PartonUIConfigContext);
  const { layouts } = config;
  const { Loader, F404 } = config.controls;

  if (error) {
    return `Error! ${error.message}`;
  }
  return (
    <div>
      {page ? (
        <PageProvider value={{ page }}>
          <Suspense fallback={<Loader />}>
            {React.createElement(layouts[page.layout.path])}
          </Suspense>
        </PageProvider>
      ) : !loading ? (
        <F404 />
      ) : undefined}
    </div>
  );
}
export function usePage() {
  return useContext(PageContext);
}
