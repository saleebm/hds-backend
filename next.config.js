const { resolve, join } = require('path')

require('dotenv').config({
  path: join(__dirname, '.env'),
})

const fontsPattern = /\.(woff|woff2|eot|ttf|otf|svg)$/
module.exports = {
  experimental: {
    // modern: true,
  },
  env: {
    TOKEN_STORAGE_KEY: process.env.TOKEN_STORAGE_KEY,
  },
  webpack(config, { isServer }) {
    // Thanks to https://github.com/zeit/next.js/issues/7755#issuecomment-508633125
    if (!isServer) {
      config.node = { fs: 'empty' }
    }

    // Refer to https://bit.ly/2PYA357 and https://git.io/JebjT
    config.module.rules.push(
      {
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
      },
      {
        test: /\.svg$/,
        include: [
          resolve(process.cwd(), 'public/static/images'),
          /node_modules/,
        ],
        exclude: resolve(process.cwd(), 'public/static/fonts'),
        use: [
          { loader: 'url-loader' },
          {
            loader: 'svgo-loader',
            options: {
              name: '[name].[contenthash].svg',
              publicPath: '/_next/static/chunks/images/',
              outputPath: `${isServer ? '../' : ''}static/chunks/images/`,
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false },
              ],
            },
          },
        ],
      },
      {
        test: fontsPattern,
        include: [
          resolve(process.cwd(), 'public/static/fonts'),
          /node_modules/,
        ],
        exclude: resolve(process.cwd(), 'public/static/images'),
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            limit: 8192,
            fallback: require.resolve('file-loader'),
            publicPath: '/_next/static/chunks/fonts/',
            outputPath: `${isServer ? '../' : ''}static/chunks/fonts/`,
            esModule: true,
          },
        },
      },
      {
        test: /\.(jpe?g|png|ico|gif)$/,
        include: [
          resolve(process.cwd(), 'public/static/images'),
          /node_modules/s,
        ],
        exclude: resolve(process.cwd(), 'public/static/fonts'),
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              limit: 8192,
              fallback: require.resolve('file-loader'),
              publicPath: '/_next/static/chunks/images/',
              esModule: true,
              outputPath: `${isServer ? '../' : ''}static/chunks/images/`,
            },
          },
        ],
      }
    )
    return config
  },
}
