import Container from '@cloudscape-design/components/container';
import ContentLayout from '@cloudscape-design/components/content-layout';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import { useIntl, FormattedMessage } from 'react-intl';

import { useApplication } from '~/hooks/application/use-application';

export function RootErrorPage() {
  const intl = useIntl();
  const { navigate } = useApplication();

  return (
    <ContentLayout
      header={
        <Header
          variant="h1"
          description={intl.formatMessage({
            defaultMessage: 'The page you are looking for does not exist',
            description: 'page not found header description',
          })}
        >
          <FormattedMessage
            defaultMessage="Page not found"
            description="page not found header"
          />
        </Header>
      }
    >
      <Container>
        <Link
          href="/"
          onFollow={(event) => {
            event.preventDefault();
            navigate('/');
          }}
        >
          <FormattedMessage
            defaultMessage="IoT Application home page"
            description="page not found link"
          />
        </Link>
      </Container>
    </ContentLayout>
  );
}
