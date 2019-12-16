module.exports = (env, argv) => {
  return {
    entry: './app.ts',

    output: {
      filename: 'bundle.js',
    },

    devtool: 'inline-source-map',

    resolve: {
      extensions: ['.ts', '.js']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
      ]
    },

    devServer: {
      writeToDisk: true,
      open: true,
    }
  }
}
