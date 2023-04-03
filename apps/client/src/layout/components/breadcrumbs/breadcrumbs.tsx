import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import { useIntl } from 'react-intl';

import { preventFullPageLoad } from '~/helpers/events';
import { useCrumbs } from './hooks/use-crumbs';
import { useApplication } from '~/hooks/application/use-application';

export function Breadcrumbs() {
  const crumbs = useCrumbs();
  const intl = useIntl();
  const { navigate } = useApplication();

  return (
    <BreadcrumbGroup
      ariaLabel={intl.formatMessage({
        defaultMessage: 'Breadcrumbs',
        description: 'breadcrumbs aria label',
      })}
      items={crumbs}
      onFollow={(event) => {
        preventFullPageLoad(event);
        navigate(event.detail.href);
      }}
    />
  );
}
