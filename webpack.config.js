const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist',
    hot: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './dist/index.html',
      filename: './dist/index-[hash].html',
      title: 'html'
    }),
  ],
};