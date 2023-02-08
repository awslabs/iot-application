import App from './App';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';

// awsResources is populated by aws-resources.js
// eslint-disable-next-line
const awsResources = (global as any).awsResources;

Amplify.configure({
  ...awsResources,
  // Overrides go here
});

const AppEl = withAuthenticator(App);

export default AppEl;
