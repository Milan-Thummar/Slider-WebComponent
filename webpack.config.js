const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/slider.ts",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "slider.js",
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/slider.html",
      }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "slider.css",
            }),
          ]
        : []),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: isProduction
        ? [
            new TerserPlugin({
              parallel: true,
            }),
            new CssMinimizerPlugin({
              parallel: true,
            }),
          ]
        : [],
    },
    devServer: isProduction
      ? undefined
      : {
          static: {
            directory: path.join(__dirname, "public"),
          },
          open: true,
        },
  };
};
