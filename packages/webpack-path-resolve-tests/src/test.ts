import * as path from "path";
import * as webpackPath from "webpack-path-resolve";

const resolve = webpackPath.resolve(require.resolve.paths);

test("jest should be found at the root of the mono repo", () => {
  const actual = resolve("jest");
  const expected = path.resolve("../../node_modules/jest");
  expect(actual).toEqual(expected);
});

test("@types/jest should be found in this package", () => {
  const actual = resolve("@types/jest");
  const expected = path.resolve("./node_modules/@types/jest");
  expect(actual).toEqual(expected);
});
