const { STSClient, GetSessionTokenCommand } = require('@aws-sdk/client-sts');
const {
  override,
  disableEsLint,
  addWebpackModuleRule,
} = require('customize-cra');
const { transform } = require('@formatjs/ts-transformer');

module.exports = {
  webpack: override(
    disableEsLint(),
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
