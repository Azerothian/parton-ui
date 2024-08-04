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
  getPage(uri: $uri, level: 3) {
    ${pageFields}
    children {
      ${pageFields}
      children {
        ${pageFields}
      }
    }
  }
}`;
export function getPageWithChildrenResult(result: any) {
  return result?.data?.getPage;
}

export const getPageQuery = gql`
  query getPage($uri: String!) {
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
`;
export const getPageQueryOptions = {
  props(info: any) {
    const { ownProps, data } = info;
    const { loading, getPage } = data;
    if (loading) {
      return Object.assign({}, ownProps, { loading });
    }
    return Object.assign({}, ownProps, { page: getPage });
  },
};

export function getPageQueryResult(result: any) {
  let data = result.data;
  if (!data) {
    data = result.previousData;
  }
  return data?.getPage;
}

// export const getPagesQuery = gql`
//   query getPages($uri: String) {
//     classMethods {
//       Item {
//         getPages(uri: $uri) {
//           id
//           name
//           displayName
//           webPath
//           layout {
//             path
//           }
//           sublayouts {
//             placeholder
//             index
//             path
//           }
//           values
//         }
//       }
//     }
//   }
// `;

// export function getPagesQueryResult(result: any) {
//   return result.data.classMethods.Item.getPages;
// }
