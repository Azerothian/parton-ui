import {
  createMemoryCacheFromJTDSchema,
  createBasicMemoryCache,
} from "./apollo/memory-cache";
export { createMemoryCacheFromJTDSchema, createBasicMemoryCache };

import {
  getRolesQuery,
  getRolesResult,
  resetPasswordMutation,
  getCurrentUserResult,
  getCurrentUserQuery,
  // getCurrentUserQueryOptions,
} from "./logic/user";
export {
  getRolesQuery,
  getRolesResult,
  resetPasswordMutation,
  getCurrentUserResult,
  getCurrentUserQuery,
  // getCurrentUserQueryOptions,
};

import {
  // getPageWithChildrenQuery,
  // getPageWithChildrenResult,
  getPageQuery,
  getPageQueryResult,
  // getPageQueryOptions,
} from "./logic/page";
export {
  // getPageWithChildrenQuery,
  // getPageWithChildrenResult,
  getPageQuery,
  getPageQueryResult,
  // getPageQueryOptions,
};

import FileNotFound from "./controls/f404";
export { FileNotFound };

import Placeholder from "./controls/placeholder";
export { Placeholder };

import Loader from "./controls/loader";
export { Loader };

import PartonUIConfigManager, {
  PartonUIConfigContext,
  usePartonUIConfig,
} from "./managers/config";
export { PartonUIConfigContext, usePartonUIConfig, PartonUIConfigManager };

import ApolloManager from "./managers/apollo";
export { ApolloManager };

import { AuthManager, useAuth } from "./managers/auth";
export { AuthManager, useAuth };

import BaseManager from "./managers/base";
export { BaseManager };

import {
  useQuery,
  useMutation,
  useLazyQuery,
  useApolloClientQuery,
} from "./data";
export { useQuery, useMutation, useLazyQuery, useApolloClientQuery };

import Page, { usePage } from "./managers/page";
export { Page, usePage };
