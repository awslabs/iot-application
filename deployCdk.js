#!/usr/bin/env node

const inquirer = require('inquirer');
const { execSync } = require('child_process');

const cognito = 'AWS Cognito';
const sso = 'AWS IAM Identity Center (formerly AWS SSO)';

const askQuestions = () => {
    const questions = [
      {
        type: 'list',
        name: 'AUTH',
        message: 'Welcome to IoT Application. Please select an authentication mode.',
        default: cognito,
        choices: [cognito, sso],
      }
    ];
  
    return inquirer.prompt(questions);
};

const run = async () => {
    const answers = await askQuestions();
  
    const { AUTH } = answers;
  
    if (AUTH === cognito) {
      execSync("yarn workspace cdk deploy:no-review:cognito", { stdio: 'inherit' });
    } else if (AUTH === sso) {
      execSync("yarn workspace cdk deploy:no-review:sso", { stdio: 'inherit' });
      console.log('Please follow README instructions to complete SSO setup after deployment: https://github.com/awslabs/iot-application/tree/main/deploymentguide');
    } else {
      execSync("yarn workspace cdk deploy:no-review:cognito", {stdio: 'inherit' });
    }
};

run();
