import { Box, Header } from '@cloudscape-design/components';

export const LoginHeader = (text: string) => {
  return (
    <Header>
      <Box padding={{ left: 'xxl' }}>IoT Application</Box>
      <Box padding={{ left: 'xxl' }}>{text}</Box>
    </Header>
  );
};
