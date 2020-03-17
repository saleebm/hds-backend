const prod = process.env.NODE_ENV === 'production'

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@Components': './src/components',
          '@Config': './src/config',
          '@Lib': './lib',
          '@Pages': './pages',
          '@Store': './src/store',
          '@Services': './src/services',
          '@Static': './public/static',
          '@Types': './src/models',
          '@Utils': './src/utils',
        },
      },
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    [
      'babel-plugin-transform-remove-console',
      {
        exclude: prod ? ['error'] : ['log', 'error', 'warn', 'table'],
      },
    ],
    // https://material-ui.com/guides/minimizing-bundle-size/#option-2
    [
      'import',
      {
        libraryName: '@material-ui/core',
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'core',
    ],
    [
      'import',
      {
        libraryName: '@material-ui/icons',
        libraryDirectory: 'esm',
        camel2DashComponentName: false,
      },
      'icons',
    ],
    [
      'import',
      {
        libraryName: '@material-ui/lab',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lab',
    ],
  ],
}
