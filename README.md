# IoT dashboard application built with IoT App Kit

The IoT dashboard application is an easy-to-use tool designed for businesses and individuals who need to keep track of their IoT devices and data. By creating and managing custom dashboards, you can effortlessly monitor your IoT devices and their data in real-time, connecting to your AWS IoT SiteWise data.

Whether you're in manufacturing, logistics, energy, or other industries relying on IoT devices, the application can help you address specific challenges such as tracking equipment performance, optimizing operational efficiency, and making data-driven decisions.

Built using [IoT App Kit](https://github.com/awslabs/iot-app-kit), a library that simplifies connecting your applications to AWS IoT, the application utilizes the AWS Cloud Development Kit (CDK) for a smooth deployment to AWS, ensuring a hassle-free setup process.

Key features of the application include:
- **Dashboard management**: Easily create, modify, view, and organize dashboards
- **Dashboard customization**: Design unique dashboards tailored to your specific IoT data requirements
- **Intuitive interface**: Enjoy a user-friendly drag-and-drop experience for creating dashboards
- **Effortless deployment**: Use the AWS CDK to deploy the application
- **Secure authentication**: Safeguard your application with AWS Cognito for user management and authentication

Start using the application today to quickly create, manage, and view your IoT data in real-time from assets in your AWS IoT SiteWise service. We encourage you to try the application, contribute to the project, and provide feedback to help us improve and enhance the application further.

## Prerequisites

1. Install [Volta](https://docs.volta.sh/guide/getting-started).
1. Install [Node.js@18 with Volta](https://docs.volta.sh/guide/#features).
1. Install [Yarn with Volta](https://docs.volta.sh/guide/#features).

## Getting Started with local development

1. Install nest a global dependency for using the Nest CLI:
   ```sh
   yarn add global nest
   ```
1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Start development server:
   ```sh
   yarn dev
   ```
1. Application is available at URL: `http://localhost:3000`
1. Log in with local Cognito credentials found at `apps/core/.cognito/db`

## Running the tests locally

Run local test command `yarn test` to test the application. The command is "batteries included" - it has everything needed to run and test the application locally.

## Updating generated types locally

Run `yarn gen:types` in root while `yarn dev` is running.

## Deploying to AWS Cloud

Instructions are located [here](https://github.com/awslabs/iot-application/blob/main/deploymentguide/README.md)

## Environments

### Service Dependencies

The table below lists the service dependencies for different environments.

| Category\Environments | [Local Development](#getting-started-with-local-development)   | [Local Test](#running-the-tests-locally)                              |
| --------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Authentication        | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [cognito-local](https://www.npmjs.com/package/cognito-local)          |
| App API Database      | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local) | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local)        |
| App API Authorization | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [JWT generated from secret](./apps/core/src/testing/jwt-generator.ts) |

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.