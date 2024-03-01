import { registerAs } from '@nestjs/config';

export const configFactory = () => {
  const { EDGE_ENDPOINT: edgeEndpoint } = process.env;

  return {
    edgeEndpoint,
  };
};

export const edgeConfig = registerAs('edge', configFactory);
