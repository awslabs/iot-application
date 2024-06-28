# IoT Dashboard Application Development Guide

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

## Getting Started with local development

1. Install Java Runtime Environment (JRE) version 11.x or newer
1. Install nest a global dependency for using the Nest CLI:
   ```sh
   yarn add global nest
   ```
1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Update the variables `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SESSION_TOKEN` under file `apps/core/.env` with your development AWS credentials.
1. Start development server:
   ```sh
   yarn dev
   ```
1. Application is available at URL: `http://localhost:3000`
1. Log in with local Cognito credentials found at `apps/core/.cognito/db/us-west-2_h23TJjQR9.json`

## Running the tests locally

Run local test command `yarn test` to test the application. The command is "batteries included" - it has everything needed to run and test the application locally.

## Updating generated types locally

Run `yarn gen:types` in root while `yarn dev` is running.

## Environments

### Service Dependencies

The table below lists the service dependencies for different environments.

| Category\Environments | [Local Development](#getting-started-with-local-development)   | [Local Test](#running-the-tests-locally)                              |
| --------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Authentication        | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [cognito-local](https://www.npmjs.com/package/cognito-local)          |
| App API Database      | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local) | [dynamodb-local](https://www.npmjs.com/package/dynamodb-local)        |
| App API Authorization | [cognito-local](https://www.npmjs.com/package/cognito-local)   | [JWT generated from secret](./apps/core/src/testing/jwt-generator.ts) |
