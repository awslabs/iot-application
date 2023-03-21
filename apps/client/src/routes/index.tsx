import { createBrowserRouter } from 'react-router-dom';
import { ROOT_INDEX_PAGE_FORMAT } from '~/constants/format';
import {
  Container,
  ContentLayout,
  Header,
} from '@cloudscape-design/components';
import { FormattedMessage, useIntl } from 'react-intl';

export const route = {
  index: true,
  element: <IndexPage />,
  handle: {
    format: ROOT_INDEX_PAGE_FORMAT,
  },
} satisfies Parameters<typeof createBrowserRouter>[0][number];

export function IndexPage() {
  const intl = useIntl();
  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description={intl.formatMessage({
            defaultMessage: 'Home of the future IoT Application',
            description: 'home page header description',
          })}
        >
          <FormattedMessage
            defaultMessage="Home"
            description="home page header"
          />
        </Header>
      }
    >
      <Container>
        <FormattedMessage
          defaultMessage="UNDER CONSTRUCTION"
          description="home page content"
        />
      </Container>
    </ContentLayout>
  );
}
