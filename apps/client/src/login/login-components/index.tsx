import { LoginFooter } from './login-footer';
import { LoginHeader } from './login-header';

export const loginComponents = {
  SignIn: {
    Header() {
      return LoginHeader('Sign in to your account');
    },
    Footer() {
      return LoginFooter({ resetPassword: true });
    },
  },
  SignUp: {
    Header() {
      return LoginHeader('Create a new account');
    },
    Footer() {
      return LoginFooter({ backToSignIn: true });
    },
  },
  ConfirmSignUp: {
    Header() {
      return LoginHeader('Enter Information:');
    },
  },
  SetupTOTP: {
    Header() {
      return LoginHeader('Enter Information:');
    },
  },
  ConfirmSignIn: {
    Header() {
      return LoginHeader('Enter Information:');
    },
  },
  ResetPassword: {
    Header() {
      return LoginHeader('Enter Information:');
    },
  },
  ConfirmResetPassword: {
    Header() {
      return LoginHeader('Enter Information:');
    },
  },
};
