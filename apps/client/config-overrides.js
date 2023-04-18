const { transform } = require('@formatjs/ts-transformer');
const {
  override,
  addWebpackModuleRule,
  addWebpackAlias,
} = require('customize-cra');
const path = require('path');

module.exports = {
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
