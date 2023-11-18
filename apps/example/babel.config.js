module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@expo/knex-expo-sqlite-dialect/babel-preset',
    ],
  };
};
