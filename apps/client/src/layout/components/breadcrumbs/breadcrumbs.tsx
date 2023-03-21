import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import { useIntl } from 'react-intl';

import { preventFullPageLoad } from '../../../helpers/events';
import { useBrowser } from '../../../hooks/browser/use-browser';
import { useCrumbs } from './hooks/use-crumbs';

export function Breadcrumbs() {
  const crumbs = useCrumbs();
  const { navigate } = useBrowser();
  const intl = useIntl();

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
