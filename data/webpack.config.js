const path = require('path')
const nodeExternals = require('webpack-node-externals')
const dotenvConfig = require('dotenv')

const envPath = path.resolve(__dirname, '.env')

dotenvConfig.config({ path: envPath })

module.exports = {
  context: __dirname,
  mode: 'development',
  entry: path.resolve(__dirname, 'index.ts'),
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../', '.dist'),
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.mjs', '.jsx', '.json', '.ts', '.tsx'],
  },
  externals: [nodeExternals()],
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3,
                  targets: {
                    esmodules: false,
                    node: true,
                  },
                },
              ],
              '@babel/preset-typescript',
            ],
            plugins: [
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          },
        },
      },
      {
        test: /\.jsx?$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                  targets: {
                    esmodules: false,
                    node: true,
                  },
                },
              ],
            ],
            plugins: [
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator',
            ],
          },
        },
      },
    ],
  },
  plugins: [],
}
