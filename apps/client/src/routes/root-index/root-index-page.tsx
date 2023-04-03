import {
  Container,
  ContentLayout,
  Header,
} from '@cloudscape-design/components';
import { FormattedMessage, useIntl } from 'react-intl';

export function RootIndexPage() {
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
