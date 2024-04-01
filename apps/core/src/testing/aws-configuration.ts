export const accessKeyId = 'fakeMyKeyId';
export const secretAccessKey = 'fakeSecretAccessKey';
export const credentials = {
  accessKeyId,
  secretAccessKey,
};

export const region = 'us-west-2';

export const databaseEndpoint = 'http://localhost:8001';
export const databaseLaunchLocal = 'false';
export const databasePort = '8001';
export const databaseTableName = 'dashboard-api-e2e-test';

export const configureTestProcessEnv = (env: NodeJS.ProcessEnv) => {
  env.DATABASE_PORT = databasePort;
  env.DATABASE_ENDPOINT = databaseEndpoint;
  env.DATABASE_TABLE_NAME = databaseTableName;
  env.DATABASE_LAUNCH_LOCAL = databaseLaunchLocal;
  env.AWS_ACCESS_KEY_ID = accessKeyId;
  env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
  env.AWS_REGION = region;
};
