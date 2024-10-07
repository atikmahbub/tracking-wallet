const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from the .env file in the root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const configFilePath = require.resolve("./tsconfig.json");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx", // Entry point for your React app
  mode: process.env.__BUILD_ENV__ === "PROD" ? "production" : "development", // Handle build mode dynamically
  output: {
    filename: "bundle.js", // Output bundle file
    path: path.resolve(__dirname, "dist"), // Output directory
    clean: true, // Clean output directory before each build
    publicPath: "/", // Important for handling client-side routing
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // Resolvable extensions
    plugins: [new TsconfigPathsPlugin({ configFile: configFilePath })], // Use tsconfig paths plugin
    alias: {
      "@trackingPortal": path.resolve(__dirname, "src"), // Custom alias for cleaner imports
    },
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/, // For JavaScript/JSX files
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.(ts)x?$/, // For TypeScript/TSX files
        exclude: /node_modules|\.d\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            projectReferences: true,
            configFile: configFilePath,
            compilerOptions: {
              noUnusedLocals: false,
              noUnusedParameters: false,
            },
          },
        },
      },
      {
        test: /\.(s[ac]ss|css)$/i, // For SCSS/CSS files
        use: [
          "style-loader", // Inject styles into DOM
          "css-loader", // Resolve CSS imports
          {
            loader: "sass-loader", // Compile Sass to CSS
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, "node_modules")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // For images
        use: [
          {
            loader: "file-loader", // Handle image assets
            options: {
              name: "[path][name].[ext]", // Preserve file name and extension
              outputPath: "assets/images/", // Output directory for the images
              publicPath: "assets/images/", // Public path in the app
            },
          },
        ],
      },
      {
        test: /\.ttf$/, // For font files
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Path to HTML template
      favicon: "./public/favicon/favicon.ico",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./public/site.webmanifest", to: "site.webmanifest" }, // Copy manifest file
        { from: "./public/favicon/favicon.ico", to: "favicon.ico" },
        { from: "./public/logo192.png", to: "logo192.png" },
        { from: "./public/logo512.png", to: "logo512.png" },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  devServer: {
    static: "./dist",
    hot: true,
    historyApiFallback: true,
    compress: true,
    liveReload: true,
    port: 8080,
    open: true,
  },
};
