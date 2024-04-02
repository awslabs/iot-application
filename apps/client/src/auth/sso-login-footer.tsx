import React from 'react';
import Button from '@cloudscape-design/components/button';

import { signInWithRedirect, SignInWithRedirectInput } from 'aws-amplify/auth';

const amplifyPaddingVariable = 'var(--amplify-components-authenticator-form-padding)';
const formStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: `0 ${amplifyPaddingVariable} ${amplifyPaddingVariable} ${amplifyPaddingVariable}`
};

export const SSOLogin = ({ input, text }: { input?: SignInWithRedirectInput; text: string; }) => (
  <div style={formStyles}>
    <Button
      variant="link"
      onClick={() => signInWithRedirect(input)}
    >{text}</Button>
  </div>
);
