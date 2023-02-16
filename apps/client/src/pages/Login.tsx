import App from './App';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// awsResources is populated by aws-resources.js
// eslint-disable-next-line
const awsResources = {
  Auth: {
    identityPoolId: 'us-east-2:0037d13a-5ebf-4a15-8aa3-689ac64892fa',
    region: 'us-east-2',
    userPoolId: 'us-east-2_f3NjWt7VA',
    userPoolWebClientId: '19oekmiq2u5kc0q2igauua0s60',
  },
};

Amplify.configure({
  ...awsResources,
  // Overrides go here
});

const AppEl = withAuthenticator(App);

export default AppEl;
