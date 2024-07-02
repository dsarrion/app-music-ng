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
              emitFile: false, // Evita que los archivos se emitan nuevamente en el servidor
            },
          },
        ],
      },
    ],
  },
};
  