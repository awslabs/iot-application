# IoT Application

Visualize your AWS IoT data with the IoT Application.

## Prerequisites

1. Install [Volta](https://docs.volta.sh/guide/getting-started).
1. Install [Node.js@18 with Volta](https://docs.volta.sh/guide/#features).
1. Install [Yarn with Volta](https://docs.volta.sh/guide/#features).
1. Install global dependencies:
   ```sh
   yarn add global nest turbo typescript
   ```

## Getting Started with local development

1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Start development server:
   ```sh
   yarn dev
   ```

## Running the tests locally

Run local test command `yarn test` to test the application. The command is "batteries included" - it has everything needed to run and test the application locally.

## Deploying to AWS Cloud

1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Build the client
   ```sh
   yarn workspace client build
   ```
1. Deploy the Core service and resource dependencies:
   ```sh
   yarn workspace cdk cdk deploy --all
   ```

## Environments

### Service Dependencies

The table below lists the service dependencies for different environments.

| Catagory\Environments | [Local Develoepment](#getting-started-with-local-development)                                | [Local Test](#running-the-tests-locally)                                              |
|-----------------------|----------------------------------------------------------------|-----------------------------------------------------------------------|
| Authentication        | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [cognito-local](https://www.npmjs.com/package/cognito-local)          |
| App API Database      | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local) | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local)        |
| App API Authorization | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [JWT generated from secret](./apps/core/src/testing/jwt-generator.ts) |

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
