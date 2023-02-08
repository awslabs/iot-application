# IoT Application

Visualize your AWS IoT data with the IoT Application.

## Getting Started

1. Create a CloudFormation with the CloudFormation template [aws-resources-cfn-template.yaml](aws-resources-cfn-template.yaml) under your AWS account
1. Install [Volta](https://docs.volta.sh/guide/getting-started).
1. Install [Node.js@18 with Volta](https://docs.volta.sh/guide/#features).
1. Install [Yarn with Volta](https://docs.volta.sh/guide/#features).
1. Install global dependencies:
   ```sh
   yarn add global nest turbo typescript
   ```
1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Update the [apps/client/aws-resources.js](apps/client/aws-resources.js) file with AWS resources created from step 1
1. Start development server:
   ```sh
   yarn dev
   ```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
