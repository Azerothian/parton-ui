import { gql } from "@apollo/client";

export const getRolesQuery = gql`
  query getRoles {
    models {
      Role {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;
export function getRolesResult(roleResult: any) {
  return (roleResult?.data?.models?.Role?.edges || []).map(
    ({ node }: any) => node,
  );
}

export const resetPasswordMutation = gql`
  mutation resetPassword($userId: ID, $password: String) {
    models {
      UserAuth(
        update: {
          where: { userId: { eq: $userId }, type: { eq: "local" } }
          input: { token: $password }
        }
      ) {
        id
      }
    }
  }
`;

export function getCurrentUserResult(result: any) {
  if (result?.data?.classMethods?.User) {
    return {
      user: result.data.classMethods.User.getCurrentUser,
      schema: result.data.classMethods.User.getCurrentUser.permissions,
    };
  }
  return {};
}

export const getCurrentUserQuery = gql`
  query getCurrentUserQuery {
    classMethods {
      User {
        getCurrentUser {
          id
          userName
          firstName
          lastName
          email
          disabled
          role {
            name
          }
        }
      }
    }
  }
`;
export const getCurrentUserQueryOptions = {
  options: {
    pollInterval: 1000 * 60 * 5,
  },
  props(info: any) {
    const { ownProps, data } = info;
    const { loading, classMethods } = data;

    if (loading) {
      return Object.assign({}, ownProps, { loading });
    }
    let user, role, schema;
    if (classMethods && classMethods.User && classMethods.User.getCurrentUser) {
      user = classMethods.User.getCurrentUser;
      role = user.role.name;
    }
    return Object.assign({}, ownProps, {
      loading: loading || ownProps.loading,
      user,
      role,
      schema,
    });
  },
};

export const loginMutation = gql`
  mutation loginMutation($username: String, $password: String) {
    classMethods {
      User {
        login(userName: $username, password: $password)
      }
    }
  }
`;
export function loginMutationResult(result: any) {
  if (result.data?.classMethods?.User) {
    return result.data.classMethods.User.login;
  }
  return false;
}

export const loginMutationOptions = {
  name: "loginMutation",
  options: {
    refetchQueries: [{ query: getCurrentUserQuery }],
    awaitRefetchQueries: true,
  },
};

export const logoutMutation = gql`
  mutation logout {
    classMethods {
      User {
        logout
      }
    }
  }
`;

export const logoutMutationOptions = {
  name: "logout",
  options: {
    refetchQueries: [{ query: getCurrentUserQuery }],
  },
};

export const getIsLoggedInQuery = gql`
  query isLoggedIn {
    classMethods {
      User {
        isLoggedIn
      }
    }
  }
`;

export function getIsLoggedInResult(result: any) {
  if (result.data?.classMethods?.User) {
    return result.data.classMethods.User.isLoggedIn;
  }
  return false;
}

export const selectUserFields = `
id
userName
disabled
firstName
lastName
email
roleId
role {
  name
}`;

export const getUserListQuery = gql`query getUserList($where: GQLTQueryUserWhere, $pageSize: Int, $cursor: String, $orderBy: [UserOrderBy]) {
  models {
    User(first: $pageSize, after: $cursor, where: $where, orderBy: $orderBy) {
      total
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          ${selectUserFields}
        }
      }
    }
  }
}`;
export function getUserListResult(result: any) {
  if (!result.data.models) {
    return undefined;
  }
  return result.data.models.User;
}

export const getUserByIdQuery = gql`query getUserById($id: ID) {
  models {
    User(first: 1, where: {
      id: {
        eq: $id
      }
    }) {
      edges {
        node {
          ${selectUserFields}
        }
      }
    }
  }
}`;
export function getUserResult(result: any) {
  if (!result.data.models) {
    return undefined;
  }
  return result.data.models.User.edges[0].node;
}

export const createUserMutation = gql`mutation createUser($input: [UserRequiredInput]) {
  models {
    User(create: $input) {
      ${selectUserFields}
    }
  }
}`;

export const updateUserByIdMutation = gql`mutation updateUserById($id: ID, $input: UserOptionalInput) {
  models {
    User(update: {
      limit: 1
      where: {
        id: {
          eq: $id
        }
      }
      input: $input
    }) {
      ${selectUserFields}
  }}
}`;

export function getUserMutationResult(result: any) {
  if (!result.data.models) {
    return undefined;
  }
  return result.data.models.User[0];
}