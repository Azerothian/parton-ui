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

import { AuthManager, useAuth } from "./managers/auth";
export { AuthManager, useAuth };

import BaseManager from "./managers/base";
export { BaseManager };

import { useQuery, useMutation } from "./data";
export { useQuery, useMutation };

import Page, { usePage } from "./managers/page";
export { Page, usePage };
