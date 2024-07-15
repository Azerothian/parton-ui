import { gql, useQuery } from "@apollo/client";
import React, { Suspense, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PartonUIConfigContext } from "./config";
// export interface PageProps {}

export const PageContext = React.createContext({
  page: undefined,
});
export const PageProvider = PageContext.Provider;
export const PageConsumer = PageContext.Consumer;

export const getPageQuery = gql`
  query getPage($uri: String) {
    classMethods {
      Item {
        getPage(uri: $uri) {
          id
          name
          displayName
          webPath
          layout {
            path
          }
          sublayouts {
            placeholder
            index
            path
            props
          }
          values
        }
      }
    }
  }
`;
export const getPageQueryOptions = {
  props(info: any) {
    const { ownProps, data } = info;
    const { loading, classMethods } = data;
    if (loading) {
      return Object.assign({}, ownProps, { loading });
    }
    return Object.assign({}, ownProps, { page: classMethods.Item.getPage });
  },
};

export function getPageQueryResult(result: any) {
  let data = result.data;
  if (!data) {
    data = result.previousData;
  }
  return data?.classMethods?.Item?.getPage;
}

export default function Page() {
  const location = useLocation();
  const u = new URL(window.location.toString());
  const p = `${u.protocol}//${u.host}${location.pathname}`;
  const result = useQuery(getPageQuery, {
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
