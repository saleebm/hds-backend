module.exports = {
  experimental: {
    modern: true
  },
  webpack(config, { isServer }) {
    // Thanks to https://github.com/zeit/next.js/issues/7755#issuecomment-508633125
    if (!isServer) {
      config.node = { fs: 'empty' }
    }

    // Refer to https://bit.ly/2PYA357 and https://git.io/JebjT
    config.module.rules.push({
      test: /\.tsx?$/,
      enforce: 'pre',
      exclude: [/node_modules/, /\.next/, /out/],
      use: [
        {
          options: {
            fix: true,
            cache: true,
            emitWarning: true,
            eslintPath: require.resolve('eslint'),
          },
          loader: require.resolve('eslint-loader'),
        },
      ],
    })
    return config
  },
}
