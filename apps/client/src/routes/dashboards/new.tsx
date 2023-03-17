import { ContentLayout, Header } from '@cloudscape-design/components';
import { FormattedMessage } from 'react-intl';

import { CreateDashboardForm } from './CreateDashboardForm';

export function CreateDashboardPage() {
  return (
    <ContentLayout
      header={
        <Header variant="h1">
          <FormattedMessage
            defaultMessage="Create dashboard"
            description="create dashboard heading"
          />
        </Header>
      }
    >
      <CreateDashboardForm />
    </ContentLayout>
  );
}
