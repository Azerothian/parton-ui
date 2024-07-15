import { gql, useQuery } from "@apollo/client";
import React, { Suspense, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/loader";
import F404 from "../f404";

export interface LayoutCollection {
  [key: string]: React.ComponentType;
}
export interface PageProps {
  layouts: LayoutCollection;
  components: LayoutCollection;
}

export const PageContext = React.createContext({
  page: undefined,
  components: {} as LayoutCollection,
  layouts: {} as LayoutCollection,
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

export default function Page(props: PageProps) {
  let location = useLocation();
  const u = new URL(window.location.toString());
  const p = `${u.protocol}//${u.host}${location.pathname}`;
  const result = useQuery(getPageQuery, {
    variables: { uri: p },
  });
  const { loading, error } = result;

  const page = getPageQueryResult(result);
  useEffect(() => {
    document.title = `${(page || {}).displayName || ""}`;
  }, [page]);
  if (error) {
    return `Error! ${error.message}`;
  }
  // if (loading) {
  //   return (<React.Fragment />);
  // }
  return (
    <div>
      {page ? (
        <PageProvider
          value={{ page, components: props.components, layouts: props.layouts }}
        >
          <Suspense fallback={<Loader />}>
            {React.createElement(props.layouts[page.layout.path])}
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
