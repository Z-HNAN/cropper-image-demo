// dev环境

const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, '..', 'build'),
  },
  module: {
    rules: [
      // ts
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['import', {
                  "libraryName": 'antd',
                  "libraryDirectory": 'es',
                  "style": 'css',
                }]
              ],
              presets: ['@babel/preset-react'],
            },
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      // project css
      {
        test: /\.css$/,
        exclude: [resolve(__dirname, '..', 'node_modules')],
        use: [
          {
            loader: 'style-loader',
          }, 
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },
        ],
      },
      // node_modules css
      {
        test: /\.css$/,
        include: [resolve(__dirname, '..', 'node_modules')],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    // html
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
  },
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    hot: true,
    port: 3000,
    host: '0.0.0.0',
    disableHostCheck: true,
    open: true,
  },
};
