module.exports = {
  presets: ["babel-preset-expo"],
  env: {
    production: {},
  },
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true,
      },
    ],
    ["@babel/plugin-proposal-optional-catch-binding"],
    [
      "module-resolver",
      {
        alias: {
          "@native-base/icons": "@native-base/icons/lib",
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
}