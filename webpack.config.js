// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const webpack = require('webpack')
module.exports = {
  // entry: "./src/index.ts", // 번들링 시작 위치
  entry: "./src/vscode.ts", // 번들링 시작 위치
  output: {
    path: path.join(__dirname, "/dist"), // 번들 결과물 위치
    filename: "bundle.js",
    library: 'VSCode',
    libraryTarget: 'window',
    libraryExport: 'default'
  },
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /[\.js]$/, // .js 에 한하여 babel-loader를 이용하여 transpiling
        exclude: /node_module/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts$/, // .ts 에 한하여 ts-loader를 이용하여 transpiling
        exclude: /node_module/,
        use: {
          loader: "ts-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    modules: [path.join(__dirname, "src"), "node_modules"], // 모듈 위치
    extensions: [".ts", ".js"],
    fallback: {
      path: require.resolve("path-browserify"),
    },
  },
  target : ['web','es2020'],
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 템플릿 위치
    }),
    new MonacoWebpackPlugin(),
    // new webpack.NormalModuleReplacementPlugin(/s+/, (resource)=>{
    //   console.log(resource)
    // }),
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => { //node:url 웹팩 5 버그. 수정.
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "url":
          resource.request = "format";
          // resource.request = "url";
          break;
        default:
          throw new Error(`Not found ${mod}`);
        }
    }),
  ],
  devServer: {
    static: [
      {
        directory: path.join(__dirname, "/src/extensions"),
        publicPath: "/extensions",
      },
      {
        directory: path.join(__dirname, "/src/css"),
        publicPath: "/css",
      },
    ],
    host: "localhost", // live-server host 및 port
    port: 5500,
  },
  // mode: "development", // 번들링 모드 development / production
  mode: "production", // 번들링 모드 development / production
};
