
const { makeMetroConfig } = require("@rnx-kit/metro-config")
const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks")
const { getDefaultConfig } = require("metro-config")

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig()
  return makeMetroConfig({
    projectRoot: __dirname,
    // watchFolders: [`${__dirname}/../..`], // for monorepos
    resolver: {
      /**
       * This custom resolver is for if you're using symlinks.
       *
       * You can disable it if you're not using pnpm or a monorepo or symlinks.
       */
      resolveRequest: MetroSymlinksResolver(),
      assetExts: [...defaultConfig.resolver.assetExts, "bin"],
      sourceExts: [
        ...defaultConfig.resolver.sourceExts,
        "mjs",
],
    },
  })
})()
