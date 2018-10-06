const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  node: {
    // Consider suggesting jsmediatags use: https://github.com/feross/is-buffer
    // Cuts 22k
    Buffer: false,
    fs: "empty"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            envName: "library"
          }
        }
      },
      {
        test: /\.(wsz|mp3)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: true,
              name: "[path][name]-[hash].[ext]"
            }
          }
        ]
      }
    ],
    noParse: [/jszip\.js$/]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "library-report.html",
      openAnalyzer: false
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      parallel: true,
      uglifyOptions: {
        compress: {
          // Workaround: https://github.com/mishoo/UglifyJS2/issues/2842
          inline: false
        }
      }
    })
  ],
  entry: {
    bundle: "./src/js/webamp.js",
    "bundle.min": "./src/js/webamp.js",
    "lazy-bundle": "./src/js/webampLazy.js",
    "lazy-bundle.min": "./src/js/webampLazy.js"
  },
  output: {
    path: path.resolve(__dirname, "../built"),
    filename: "webamp.[name].js",
    library: "Webamp",
    libraryTarget: "umd",
    libraryExport: "default"
  }
};
