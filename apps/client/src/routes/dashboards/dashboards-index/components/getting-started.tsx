import { memo } from 'react';
import {
  Box,
  ColumnLayout,
  ExpandableSection,
  Link,
  SpaceBetween,
} from '@cloudscape-design/components';
import { FormattedMessage, useIntl } from 'react-intl';

import { gettingStartedColumnsTypes } from './types';
import Dashboard from '../assets/Dashboard.svg';
import Widget from '../assets/Widget.svg';
import AssetsSearch from '../assets/AssetsSearch.svg';
import './styles.css';

const ValueWithLabel = ({
  label,
  children,
}: {
  label: string;
  children: string;
}) => (
  <Box margin={{ bottom: 'xxl' }}>
    <Box variant="awsui-key-label">{label}</Box>
    <Box>{children}</Box>
  </Box>
);

const GettingStarted = () => {
  const intl = useIntl();

  const gettingStartedColumnArray: gettingStartedColumnsTypes[] = [
    {
      columnTitle: intl.formatMessage({
        defaultMessage: 'Step 1: Create your dashboard',
        description: 'step 1 title',
      }),
      icon: Dashboard,
      className: 'getting-started-step1-icon',
      columnDescription: intl.formatMessage({
        defaultMessage:
          "Data models explorer defines data elements required to align your business objectives with Amazon Fraud Detector's data models.",
        description: 'step 1 description',
      }),
    },
    {
      columnTitle: intl.formatMessage({
        defaultMessage: 'Step 2: Add widget',
        description: 'step 2 title',
      }),
      icon: Widget,
      className: 'getting-started-step2-icon',
      columnDescription: intl.formatMessage({
        defaultMessage:
          "Data models explorer defines data elements required to align your business objectives with Amazon Fraud Detector's data models.",
        description: 'step 2 description',
      }),
    },
    {
      columnTitle: intl.formatMessage({
        defaultMessage: 'Step 3: Browse and add your assets',
        description: 'step 3 title',
      }),
      icon: AssetsSearch,
      className: 'getting-started-step3-icon',
      columnDescription: intl.formatMessage({
        defaultMessage:
          'Select your training data source (53 or ingested events) and begin model training with only a few clicks.',
        description: 'step 3 desc',
      }),
    },
  ];

  return (
    <ExpandableSection
      defaultExpanded
      variant="container"
      headerText={
        <FormattedMessage
          defaultMessage="Getting started"
          description="Getting started title"
        />
      }
      headerInfo={
        <Link
          variant="info"
          href="https://github.com/awslabs/iot-application/blob/main/docs/user-guide.md"
        >
          <FormattedMessage defaultMessage="Info" description="Info link" />
        </Link>
      }
    >
      <ColumnLayout columns={3} variant="text-grid">
        {gettingStartedColumnArray.map((col, idx) => (
          <SpaceBetween size="l" key={`${col.columnTitle}-${idx}`}>
            <Box textAlign="center">
              <div className={col.className}>
                <img src={col.icon} alt={col.columnTitle} />
              </div>
            </Box>
            <ValueWithLabel label={col.columnTitle}>
              {col.columnDescription}
            </ValueWithLabel>
          </SpaceBetween>
        ))}
      </ColumnLayout>
    </ExpandableSection>
  );
};

export default memo(GettingStarted);
