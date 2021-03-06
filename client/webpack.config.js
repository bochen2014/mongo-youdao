const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const copyWebpackPlugin = require("copy-webpack-plugin");

const env = process.env.NODE_ENV;
console.log(`********** webpack env=${JSON.stringify(env)} *********`);

const production = env === "production";
module.exports = {
  mode: production ? "production" : "development",
  devtool: production ? "" : "cheap-module-source-map",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              module: true,
              localIdentName: "[name]__[local]"
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                autoprefixer({
                  browsers: ["last 2 versions"]
                })
              ]
            }
          },
          "less-loader"
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              fallback: "file-loader",
              limit: 10000,
              minetype: "image/svg+xml"
            }
          }
        ]
      },
      {
        test: /\.(ico)|((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), //required when run from wds cli
    new copyWebpackPlugin([path.resolve(__dirname, "./index.html")])
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json", ".less"]
  },
  devServer: {
    disableHostCheck: true,
    host: "0.0.0.0",
    port: 3000,
    historyApiFallback: true,

    //#######################################################################
    //> https://github.com/webpack/webpack/issues/1151#issuecomment-343800515
    hot: true, // if you set `hot` to true within `devServer` section and run `webpack-dev-server` cli, you must
    // either `new webpack.HotModuleReplacementPlugin()`
    // or,
    // put `--hot` in cli options (which instruct wds to auto insert a HMRPlugin into your webpac.config.js)
    //#######################################################################

    proxy: {
      "/api": "http://localhost:8080"
    }
  }
};
