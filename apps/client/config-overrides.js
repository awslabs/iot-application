const { STSClient, GetSessionTokenCommand } = require("@aws-sdk/client-sts");

module.exports = {
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
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

      // Return your customised Webpack Development Server config.
      return config;
    };
  },
};