
const { resolve } = require('path')

// css
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

// html
const HtmlWebpackPlugin = require('html-webpack-plugin')

// PWA
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, '..', 'build'),
  },
  module: {
    rules: [
      // project css
      {
        test: /\.css$/,
        exclude: [resolve(__dirname, '..', 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('postcss-preset-env')()]
            }
          },
        ],
      },
      // node_modules css
      {
        test: /\.css$/,
        include: [resolve(__dirname, '..', 'node_modules')],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('postcss-preset-env')()]
            }
          }
        ],
      },
      // 处理ts
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
              presets: [
                ['@babel/preset-react'],
                [
                  '@babel/preset-env',
                  // core-js 按需加载
                  {
                    useBuiltIns: 'usage',
                    corejs: { version: 3 },
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17',
                    },
                  },
                ],
              ]
            }
          },
          {
            loader: 'ts-loader',
          },
        ]
      },
      // 处理图片资源
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          outputPath: 'imgs',
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      // // 处理其他资源
      // {
      //   exclude: /\.(css|less|js|html|jpg|png|gif)$/,
      //   loader: 'file-loader',
      //   options: { outputPath: 'media' },
      // }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // 压缩html
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    // PWA
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  // 压缩html
  mode: 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
  },
  devtool: 'nosources-source-map',
  // 代码分割 vendors
  optimization: {
    splitChunks: { chunks: 'all' },
  },
  // CDN加载React
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  }
}