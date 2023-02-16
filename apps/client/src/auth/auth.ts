type AuthModule = () => {
  getCredentials: () => {
    accessKeyId: string;
    sessionToken: string;
    secretAccessKey: string;
  };
};

// TODO: Implement actual auth
const auth: AuthModule = () => {
  const getCredentials = () => ({
    accessKeyId: '',
    sessionToken: '',
    secretAccessKey: '',
  });

  return { getCredentials };
};

export default auth;
