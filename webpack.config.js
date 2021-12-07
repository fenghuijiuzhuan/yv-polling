/*
 * @path        : \webpack-vue-template\webpack.config.js
 * @message     : 
 * @Author      : yvangod
 */
const path = require('path');
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let config = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
        }],
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        ),
      },
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 100000,
            outputPath: 'images/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: [
          'html-withimg-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config = merge(config, {
      entry: './src/main.js',
      output: {
        filename: 'boundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
      devServer: {
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        hot: true
      },
      module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // 将 JS 字符串生成为 style 节点
              {
                loader: 'vue-style-loader'
              },
              // 将 CSS 转化成 CommonJS 模块
              'css-loader',
              'resolve-url-loader',
              'postcss-loader',
              // 将 Sass 编译成 CSS
              'sass-loader',
            ],
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: 'vue-style-loader'
              },
              'css-loader',
              'resolve-url-loader',
              'postcss-loader'
            ]
          },
        ]
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: "./src/index.html",
          filename: "index.html"
        }),
        new Webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
          filename: '[name].css',
        })
      ],
      devtool: 'source-map',
    })
  }
  if (argv.mode === 'production') {
    const packageName = require('./package.json').name
    console.log(packageName)
    config = merge(config, {
      entry: './lib/index.js',
      output: {
        filename: packageName + '.js',
        path: path.resolve(__dirname, 'dist'),
        // library: 'Temp',
        libraryTarget: 'umd',
        umdNamedDefine: true
      },
      optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true
          }),
          new OptimizeCssAssetsPlugin({})
        ]
      },
      module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // 将 JS 字符串生成为 style 节点
              {
                loader: MiniCssExtractPlugin.loader
              },
              // 将 CSS 转化成 CommonJS 模块
              'css-loader',
              'resolve-url-loader',
              'postcss-loader',
              // 将 Sass 编译成 CSS
              'sass-loader',
            ],
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              'css-loader',
              'resolve-url-loader',
              'postcss-loader'
            ]
          },
        ]
      },
      plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
          filename: packageName + '.css',
          chunkFilename: 'css/[contenthash:12].css'
        })
      ]
    })
  }
  return config
}
