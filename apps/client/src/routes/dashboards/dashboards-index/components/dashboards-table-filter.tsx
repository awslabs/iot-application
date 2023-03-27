import TextFilter from '@cloudscape-design/components/text-filter';
import { useIntl } from 'react-intl';

import type { TextFilterProps } from '@cloudscape-design/components/text-filter';

interface DashboardsTableFilterProps {
  count: number;
  onChange: TextFilterProps['onChange'];
  filteringText: TextFilterProps['filteringText'];
}

export function DashboardsTableFilter(props: DashboardsTableFilterProps) {
  const intl = useIntl();

  return (
    <TextFilter
      onChange={props.onChange}
      filteringText={props.filteringText}
      countText={intl.formatMessage(
        {
          defaultMessage: `
            {dashboardCount, plural,
            zero {# matches}
            one {# match}
            other {# matches}}
          `,
          description: 'dashboards table filter count text',
        },
        { dashboardCount: props.count },
      )}
      filteringPlaceholder={intl.formatMessage({
        defaultMessage: 'Find dashboards',
        description: 'dashboards table filter placeholder',
      })}
      filteringAriaLabel={intl.formatMessage({
        defaultMessage: 'Filter dashboards',
        description: 'dashboard table text filter aria label',
      })}
      filteringClearAriaLabel={intl.formatMessage({
        defaultMessage: 'Clear filter',
        description: 'dashboard table text filter clear aria label',
      })}
    />
  );
}
