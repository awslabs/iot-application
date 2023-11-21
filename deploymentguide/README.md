# IoT dashboard application deployment guide

## Deploying to AWS Cloud

This will deploy the application to your AWS account using CDK.

##### Cloud deployment prerequisites:

1. Complete the general [prerequisites](https://github.com/awslabs/iot-application/blob/main/README.md#prerequisites)
1. [Configure](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) AWS CLI credentials for making AWS service calls to setup the application
1. Install docker: https://docs.docker.com/get-docker/. Docker must be running when you run the deployment commands.
1. Install application dependencies:
   ```sh
   yarn install
   ```
1. For the initial deployment, bootstrap cdk in your account:
   ```sh
   yarn workspace cdk cdk bootstrap
   ```

##### Deployment to cloud:

Note: All commands should be run in the workspace root directory. We are using [yarn workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) to handle individual package commands.

1. Add your AWS accountId and region [here](https://github.com/awslabs/iot-application/blob/main/cdk/bin/cdk.ts#L17) to setup the cdk envrionment.
1. Install application dependencies:
   ```sh
   yarn install
   ```
1. Deploy the Core service and resource dependencies:
   ```sh
   yarn workspace cdk cdk deploy --all
   ```
1. View your application resources in CloudFormation. If you go to the stack IotApp -> Outputs you can see the URL that the application will be available from.

##### Updating the cloud application:
1. Get the latest code changes using `git fetch` and `git pull` from the root directory of the application.
1. Run `yarn install` to install any dependency updates.
1. Run `yarn workspace cdk cdk deploy --all` to deploy the latest changes. CDK stacks that do not have changes will be skipped.

##### What is happening during an update?
During an update, cdk will look at your local cdk code (which `git pull` ensured was the latest) to determine what to update. This will include client, server or infrastructure updates we've been making. When you run the deploy command, cdk will look at what is currently deployed in your AWS account under Cloudformation, and then make an update request to update your application with the latest changes we've made.

##### Potential deployment issues:
1. `Deployment failed: Error: Failed to build asset`
   * This typically happens when there is an issue with docker not running or having issues. Try restarting docker to fix this issue.
1. `User pool already has a domain configured`
   * This can happen if the domain name created by cdk is updated. AWS Cognito does not allow updates to the domain name. To fix this error, hardcode the existing domain name [here](https://github.com/awslabs/iot-application/blob/main/cdk/lib/auth/auth-stack.ts#L38).
1. `FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory`
   * This can happen if there is a circular dependency. This can be caused by the `yarn.lock` file, which keeps track of dependency versions, having an issue. Try deleting `yarn.lock` and running `yarn install` again to re-install the dependencies and fix the issue.

##### Updating a specific stack
Most of the time you can use `yarn workspace cdk cdk deploy --all`, but if you wish to specify a stack name, use the --context (-c) option, as shown in the following example.

```sh
yarn workspace cdk cdk deploy -c stackName=my-stack-name
```

## AWS IAM Identity Center (SSO) integration:
If you wish to use IAM Identity Center as your authentication source, there are some manual steps to complete first.

This integration is based on [these integration instructions](https://repost.aws/knowledge-center/cognito-user-pool-iam-integration).

#### Gather information from Cloudformation
Go to the CloudFormation console to get required resource information. You will need to take note of the following values: `domain-prefix`, `userpool-id`, `client-id` and `signin-url`. These will be used to configure IAM Identity Center as an authentication source.
1. Find the stack called `IotApp`
   * Go to the outputs tab and note down the value for `AppUrl` as the `signin-url` that will be used later.
1. Find the stack called `IotAppAuth`
   * Go to the resources tab and expand the Auth section.
   * Note down the physical id value for `UserPoolDomain` as `domain-prefix`
   * Note down the physical id value for `UserPool` as `userpool-id`
   * Note down the physical id value for `UserPoolClient` as `client-id`
#### Configure IAM Identity Center
Configure an IAM Identity Center application to be used for authentication. Visit the IAM Identity Center console. Activate IAM Identity Center if it is not already setup.
1. Go to applications
1. Choose `Add application` and `Add custom SAML 2.0 application`.
   * Enter a name and description
1. Note down the URL of the `IAM Identity Center SAML metadatafile` as `metadata-url`
1. Click next and assign any SSO users you want to be able to access this application
1. Add environment information at bottom of page. Here you will need some of the values noted earlier.
   * ACS URL = `https://<domain-prefix>.auth.<region>.amazoncognito.com/saml2/idpresponse`
   * Application SAML audience = `urn:amazon:cognito:sp:<userpool-id>`
1. Save changes
1. Manually add metadata values
   * From the application page you just created, go to actions &rarr; Edit attribute mapping
   * Fill in subject value with `${user:subject}` and choose `Persistent`
   * Add a new metadata field with values `email`, `${user:email}` and choose `Basic`
   * Save changes
#### Configure Cognito to use IAM Identity Center
Configure your cognito identity pool for identity center integration.
1. Configure user pool to use IAM Identity Center
   * Go to the cognito console and find the userpool that was just created
   * Go to sign-in experience &rarr; federated sign-in &rarr; add an identity provider
   * Under metadata document, enter hte metadata URL you noted earlier
   * Configure the SAML attriute mapping
      * Choose email, and for `User pool attribute`, type `Email`
   * Save changes
1. Choose IAM Identity Center as the user pool auth source
   * Go to the cognito console and find the userpool that was just created
   * Under the `App Integration` tab, click on the app client in the `app client list` section
   * Click `edit Hosted UI`
   * Change the value of URL to `signin-url` we noted earlier
   * Under the `Identity Proider`, select the IAM identity center application created earlier and uncheck cognito
   * Save changes
#### Sign in using IAM Identity Center for the application
Log in using IAM Identity Center. This url is different from the original cognito sign-in url.
   * Visit `https://<domain-prefix>.auth.<region>.amazoncognito.com/login?response_type=token&client_id=<client-id>&redirect_uri=<signin-url>` to sign in using IAM Identity Center as the authentication source for the application. The variables here are the same as the ones noted earlier from Cloudformation.

User management is handled from the IAM Identity Center console.

#### Sign out
1. Click the `sign-out` button in the application, you will be redirected to the IAM Identity Center applications page. 
1. Click the signout button in the top right navigation of this page to complete signing out of the application.
