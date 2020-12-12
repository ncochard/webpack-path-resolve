import * as fs from "fs";
import * as path from "path";

export type RequireResolvePathsFnc = (name: string) => null | string[];

/**
 * Return the "paths" function.
 * This "paths" function can be used in the webpack.config.js file to find all the potential
 * locations of a dependency whether that dependency was hoisted by a yarn workspace or not.
 * @param requireResolvePath Pass the function 'require.resolve.paths'.
 */
const paths = (requireResolvePath: RequireResolvePathsFnc) => (
  name: string
): string[] => {
  const options = requireResolvePath(name);
  if (options) {
    return options
      .map((p) => path.join(p, name))
      .filter((p) => fs.existsSync(p));
  }
  return [];
};

/**
 * Return the "resolve" function.
 * This "resolve" function can be used in the webpack.config.js file to find the real location of
 * any dependency whether that dependency was hoisted by a yarn workspace or not.
 * @param requireResolvePath Pass the function 'require.resolve.paths'.
 */
export const resolve = (requireResolvePath: RequireResolvePathsFnc) => (
  name: string
): string => {
  const options = paths(requireResolvePath)(name);
  if (options.length > 0) {
    return options[0];
  }
  return path.resolve(name);
};
