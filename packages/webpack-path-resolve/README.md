# webpack-path-resolve
## Install

Install with npm: `npm install --save-dev webpack-path-resolve`

Install with yarn: `yarn add webpack-path-resolve --dev`
## TL/DR
In a mono-repo, if some of your dependencies are hoisted, use this utility in your `webpack.config.js`.
```
//webpack.config.js
const path = require("path");
const webpackPath = require("webpack-path-resolve");
const resolve = webpackPath.resolve(require.resolve.paths);

//If "lodash" is hoisted...
resolve("lodash"); // returns the correct path
path.resolve("./node_modules/lodash"); // returns an incorrect path
```
## Why do you need this?
If you do not use a monorepo, and if you do not use the [yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), you do not need this utility.

**The Problem**
If however, you use a mono-repo with a yarn workspace (or `pnpm`), then yarn may hoist some of your dependencies to the root. Whether yarn will hoist a dependency such as `lodash` to the root of the mono-repo depends on whether a different version of that dependency is used by another package within the mono-repo. It is slightly unpredictable.
```
my-monorepo/
	node_modules/
		lodash@v1
	packages/
		package-a/
			node_modules/
				lodash@v2
			package.json
			webpack.config.js
		package-b/
			node_modules/
			package.json
			webpack.config.js
package.json
lerna.json
yarn.lock
```
This causes some issues with the `webpack.config.js` files. It is common practice to use in a `webpack.config.js`  the notation `path.resolve("./node_modules/lodash")` when configuring a loader or an alias. **But this notation will only work if the package is NOT hoisted.**

**The Solution** 
```
//webpack.config.js
import * as path from "path";
import * as webpackPath from "webpack-path-resolve";
const resolve = webpackPath.resolve(require.resolve.paths);

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          //path.resolve("./node_modules/lodash"); // INCORRECT: ./my-monorepo/packages/package-a/node_modules/lodash
          resolve("lodash"); // CORRECT: ./my-monorepo/node_modules/lodash
        ],
        use: ["source-map-loader"]
      }
    ],
    ...
  },
  ...
}
```


The utility `webpack-path-resolve` followed the typical nodejs module resolution process. It will scan recursively the following folders to find the dependency.


	const resolve = webpackPath.resolve(require.resolve.paths);
	resolve("lodash");
	// This will scan the following folders for the lodash dependency.
	// ./my-monorepo/packages/package-a/node_modules/lodash
	// ./my-monorepo/packages/node_modules/lodash
	// ./my-monorepo/node_modules/lodash
	// ${HOME}/node_modules/lodash