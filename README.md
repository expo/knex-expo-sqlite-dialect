# @expo/knex-expo-sqlite-dialect

Knex.js dialect for Expo SQLite

## Installation

1. Install the package

`yarn add @expo/knex-expo-sqlite-dialect`

2. Add babel preset to the **babel.config.js**

```diff
--- a/babel.config.js
+++ b/babel.config.js
@@ -3,6 +3,7 @@ module.exports = function (api) {
   return {
     presets: [
       'babel-preset-expo',
+      '@expo/knex-expo-sqlite-dialect/babel-preset',
     ],
   };
 };
```

3. Add the custom dialect for knex constructor

```ts
import ExpoSQLiteDialect from '@expo/knex-expo-sqlite-dialect';
import Knex from 'knex';

const knex = Knex({
  client: ExpoSQLiteDialect,
  connection: {
    filename: 'MyDB.db',
  },
});
```

## Components

### `packages/knex-expo-sqlite-dialect`

The main package

> [**babel-preset**](#todo)

Since Knex.js is developed on Node.js runtime, some of Node.js dependencies are not available on React Native. The Babel preset uses the [`babel-plugin-module-resolver`](https://www.npmjs.com/package/babel-plugin-module-resolver) plugin to alias these Node.js modules to other supported modules.

### `apps/example`

The example app replicated from the [`with-sqlite` example](https://github.com/expo/examples/blob/master/with-sqlite).
