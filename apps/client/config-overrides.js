const { transform } = require('@formatjs/ts-transformer');
const {
  override,
  addWebpackModuleRule,
  addWebpackAlias,
  overrideDevServer,
} = require('customize-cra');
const path = require('path');

module.exports = {
  devServer: overrideDevServer(
    (config) => {
      // writeToDisk for Core consumption https://github.com/webpack/webpack-dev-middleware#writetodisk
      config.devMiddleware.writeToDisk = true;
      return config
    },
  ),
  webpack: override(
    addWebpackAlias({
      '~': path.resolve(__dirname, 'src'),
    }),
    // https://formatjs.io/docs/getting-started/installation#ts-loader
    addWebpackModuleRule({
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            getCustomTransformers() {
              return {
                before: [
                  transform({
                    overrideIdFn: '[sha512:contenthash:base64:6]',
                  }),
                ],
              };
            },
          },
        },
      ],
    }),
  ),
};
