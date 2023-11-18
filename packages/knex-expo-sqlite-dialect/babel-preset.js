function babelPresetKnexReactNative() {
  return {
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          alias: {
            crypto: require.resolve('crypto-browserify'),
            events: require.resolve('events'),
            fs: require.resolve('node-libs-browser/mock/empty'),
            stream: require.resolve('stream-browserify'),
            timers: require.resolve('./enhanced-timers'),
            tty: require.resolve('tty-browserify'),
          },
        },
      ],
    ],
  };
}

module.exports = babelPresetKnexReactNative;
