import { gql } from "@apollo/client";

const pageFields = `id
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
values`;

export const getPageWithChildrenQuery = gql`query getPageWithChildren($uri: String) {
  classMethods {
    Item {
      getPage(uri: $uri) {
        ${pageFields}
        children {
          ${pageFields}
          children {
            ${pageFields}
          }
        }
      }
    }
  }
}`;
export function getPageWithChildrenResult(result: any) {
  if (result.data) {
    if (result.data.classMethods) {
      if (result.data.classMethods.Item) {
        return result.data.classMethods.Item.getPage;
      }
    }
  }
  return undefined;
}

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

export const getPagesQuery = gql`
  query getPages($uri: String) {
    classMethods {
      Item {
        getPages(uri: $uri) {
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
          }
          values
        }
      }
    }
  }
`;

export function getPagesQueryResult(result: any) {
  return result.data.classMethods.Item.getPages;
}
