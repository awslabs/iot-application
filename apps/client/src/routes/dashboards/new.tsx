import { ContentLayout, Header } from '@cloudscape-design/components';

import { CreateDashboardForm } from './CreateDashboardForm';

export function CreateDashboardPage() {
  return (
    <ContentLayout header={<Header variant="h1">Create dashboard</Header>}>
      <CreateDashboardForm />
    </ContentLayout>
  );
}
