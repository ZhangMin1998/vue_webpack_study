// Node.js的核心模块，专门用来处理文件路径.
const path = require("path")
const ESLintPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getStyleLoaders = (proProcessor) => {
  return [
    MiniCssExtractPlugin.loader, // 提取css成单独文件
    "css-loader", 
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    proProcessor
  ].filter(Boolean)
}

module.exports = {
  // 模式
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: './src/main.js',
  output: {
    path: undefined,
    filename: 'static/js/[name].js', // 入口文件打包输出文件名
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[hash:8][ext][query]',
    clean: true, // 自动将上次打包目录资源清空
  },
  // 加载器
  module: {
    rules: [
      // loader配置
      {
        oneOf: [
          // ---------处理样式-----------
          {
            test: /\.css$/, // // 用来匹配 .css 结尾的文件
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/,
            use: getStyleLoaders('less-loader'),
          },
          {
            test: /\.s[ac]ss$/,
            use: getStyleLoaders('sass-loader'),
          },
          {
            test: /\.styl$/,
            use: getStyleLoaders('stylus-loader'),
          },
          // ---------处理图片-----------
          {
            test: /\.(png|jpe?g|gif|webp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                // 小于5kb的图片会被base64处理
                // 优点：减少请求数量
                // 缺点：体积变得更大
                maxSize: 5 * 1024
              }
            },
            generator: {
              // 输出图片名称
              // hash:8哈希值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: 'static/images/[hash:8][ext][query]'
            }
          },
          // ---------处理字体图标-----------
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: "asset/resource",
            generator: {
              filename: "static/media/[hash:8][ext][query]",
            },
          },
          // ---------babel-----------
          {
            test: /\.jsx?$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            // include: path.resolve(__dirname, "../src"), // 也可以用包含
            loader: "babel-loader",
            options: {
              // presets: ["@babel/preset-env"], // 单独建文件写
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
            // use: [
            //   {
            //     loader: "thread-loader", // 开启多进程
            //     options: {
            //       workers: threads, // 数量
            //     },
            //   },
            //   {
            //     loader: "babel-loader",
            //     options: {
            //       cacheDirectory: true, // 开启babel编译缓存
            //       cacheCompression: false, // 缓存文件不要压缩
            //       plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
            //     },
            //   },
            // ]
          },
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
      // threads, // 开启多进程和设置进程数量
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html")
    }),
    // // 提取css成单独文件
    // new MiniCssExtractPlugin({
    //   filename: "static/css/main.css"
    // }),
    // // css压缩
    // new CssMinimizerPlugin(),
    //  // 开启多进程
    // new TerserPlugin({
    //   parallel: threads
    // })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}.js`
    }
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 3000,
    hot: true,
    // compress: true,
    // historyApiFallback: true, // 解决vue-router刷新404问题
  },
}