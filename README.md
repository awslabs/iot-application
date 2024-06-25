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

On most Unix systems including macOS, you can install the prerequisites with a single command:
```sh
./install-prepreqs-unix.sh
```

Alternatively, you can install the prerequisites by following the instruction below:

1. [Install Volta](https://docs.volta.sh/guide/getting-started) using the environment specific commands listed below
   * Unix based environments
      ```sh
      curl https://get.volta.sh | bash
      ```
      After installing Volta, if applicable, you may need to refresh your bash profile using `source ~/.bashrc` to use Volta commands
   * Windows environments
      * Download and run Windows installer [here](https://docs.volta.sh/guide/getting-started)
1. [Install Node.js@18](https://docs.volta.sh/guide/#features) with Volta
   ```sh
   volta install node@18
   ```
1. [Install Yarn](https://docs.volta.sh/guide/#features) with Volta 
   ```sh
   volta install yarn
   ```

## Deploying to AWS Cloud

Instructions are located [here](./deploymentguide/README.md)

## Development

To start development, please refer to [development guide](./developmentguide/README.md).

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.