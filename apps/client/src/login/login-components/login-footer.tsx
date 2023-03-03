import { useAuthenticator } from '@aws-amplify/ui-react';
import { Box, Button, Header } from '@cloudscape-design/components';

type LoginFooterTypes = {
  resetPassword?: boolean;
  backToSignIn?: boolean;
};

export const LoginFooter = ({
  resetPassword,
  backToSignIn,
}: LoginFooterTypes) => {
  const { toResetPassword, toSignIn } = useAuthenticator();

  return (
    <Header>
      <Box padding={{ left: 'xxl' }} textAlign="center">
        {resetPassword && (
          <Button onClick={toResetPassword}>Reset Password</Button>
        )}
        {backToSignIn && <Button onClick={toSignIn}>Back to Sign In</Button>}
      </Box>
    </Header>
  );
};
