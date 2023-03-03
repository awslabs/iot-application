import { Root } from '../root/root';
import { Amplify } from 'aws-amplify';
import {
  withAuthenticator,
  WithAuthenticatorOptions,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { loginComponents } from './login-components/index';
import { loginFormFields } from './login-form-fields';

// awsResources is populated by aws-resources.js
// eslint-disable-next-line
const awsResources = (global as any).awsResources;

Amplify.configure({
  ...awsResources,
  // Overrides go here
});

const authenticatorOptions: WithAuthenticatorOptions = {
  formFields: loginFormFields,
  components: loginComponents,
};

export const LoginPage = withAuthenticator(Root, authenticatorOptions);
