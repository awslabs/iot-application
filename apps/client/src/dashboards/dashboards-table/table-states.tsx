import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import React from 'react';
import messages from '../../assets/messages';

export const NoMatch: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {messages.noMatches}
      </Box>

      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        {messages.noMatches2}
      </Box>

      <Button onClick={onClick}>{messages.clear}</Button>
    </Box>
  );
};

export const Empty: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <Box textAlign="center" color="inherit">
      <Box variant="strong" textAlign="center" color="inherit">
        {messages.noDashboards}
      </Box>

      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        {messages.noDashboards2}
      </Box>

      <Button onClick={onClick}>{messages.createDashboard}</Button>
    </Box>
  );
};
