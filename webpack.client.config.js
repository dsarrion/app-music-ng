module.exports = {
    module: {
      rules: [
        {
          test: /\.woff2$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts/',
                publicPath: 'assets/fonts/',
              }
            }
          ]
        }
      ]
    }
  };
  