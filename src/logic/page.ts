import { gql } from "@apollo/client";

export const getPageQuery = gql`
  query getPage($uri: String!, $level: Int) {
    getPage(uri: $uri, level: $level) {
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

export function getPageQueryResult(result: any) {
  let data = result.data;
  if (!data) {
    data = result.previousData;
  }
  return data?.getPage;
}
