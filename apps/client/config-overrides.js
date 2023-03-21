const { STSClient, GetSessionTokenCommand } = require('@aws-sdk/client-sts');
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
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      // Overrides the original `devServer.onBeforeSetupMiddleware` to add a custom AWS Credentials vending handler
      const origOnBeforeSetupMiddleware = config.onBeforeSetupMiddleware;

      config.onBeforeSetupMiddleware = function (devServer) {
        if (!devServer) {
          throw new Error('webpack-dev-server is not defined');
        }

        origOnBeforeSetupMiddleware(devServer);

        devServer.app.get('/credentials.json', async (req, res) => {
          const stsClient = new STSClient({});
          const token = await stsClient.send(new GetSessionTokenCommand({}));

          res.json(token.Credentials);
        });
      };

      return config;
    };
  },
};
