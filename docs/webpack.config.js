const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function (env) {
  const devMode = env && env.dev;
  return {
    devServer: {
      open: true,
    },
    devtool: devMode ? "eval" : "source-map",
    entry: path.resolve(__dirname, "index.js"),
    mode: devMode ? "development" : "production",
    module: {
      rules: [
        {
          test: /node_modules\/(pdfkit|fontkit|png-js|linebreak|brotli)\//,
          loader: "transform-loader?brfs",
        },
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          include: path.resolve(__dirname),
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      ],
    },
    node: {
      fs: "empty",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "index.html"),
      }),
    ],
    output: {
      path: path.resolve(__dirname, "site"),
    },
  };
};
