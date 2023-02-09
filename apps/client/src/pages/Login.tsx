import App from './App';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// awsResources is populated by aws-resources.js
// eslint-disable-next-line
const awsResources = (global as any).awsResources;

Amplify.configure({
  ...awsResources,
  // Overrides go here
});

const AppEl = withAuthenticator(App);

export default AppEl;
