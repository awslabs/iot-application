import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Form from '@cloudscape-design/components/form';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { FormattedMessage } from 'react-intl';

import { CreateDashboardFormActions } from './components/create-dashboard-form-actions';
import { DashboardNameField } from './components/dashboard-name-field';
import { DashboardDescriptionField } from './components/dashboard-description-field';
import { useCreateDashboardForm } from './hooks/use-create-dashboard-form';
import { useCreateDashboardMutation } from './hooks/use-create-dashboard-mutation';
import { isNotFatal } from '~/helpers/predicates/is-not-fatal';

export function CreateDashboardPage() {
  const createDashboardMutation = useCreateDashboardMutation();
  const { control, handleSubmit } = useCreateDashboardForm();

  function getFormErrorText() {
    return isNotFatal(createDashboardMutation.error)
      ? createDashboardMutation.error.message
      : '';
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void handleSubmit((formData) => {
          createDashboardMutation.mutate(formData);
        })();
      }}
    >
      <Form
        variant="full-page"
        header={
          <Header variant="h1">
            <FormattedMessage
              defaultMessage="Create dashboard"
              description="create dashboard heading"
            />
          </Header>
        }
        actions={
          <CreateDashboardFormActions
            isLoading={createDashboardMutation.isLoading}
          />
        }
        errorText={getFormErrorText()}
      >
        <Container>
          <SpaceBetween size="l">
            <DashboardNameField control={control} />
            <DashboardDescriptionField control={control} />
          </SpaceBetween>
        </Container>
      </Form>
    </form>
  );
}
