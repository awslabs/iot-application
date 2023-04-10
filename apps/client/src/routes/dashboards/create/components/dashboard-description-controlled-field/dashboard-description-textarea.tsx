import Textarea from '@cloudscape-design/components/textarea';
import { useIntl } from 'react-intl';

import type { TextareaProps } from '@cloudscape-design/components/textarea';

export interface DashboardDescriptionTextareaProps {
  /** Dashboard description change handler */
  onChange: TextareaProps['onChange'];
  /** Dashboard description value */
  value: string;
}

/** Displayed textarea element for the dashboard description */
export function DashboardDescriptionTextarea({
  onChange,
  value,
}: DashboardDescriptionTextareaProps) {
  const intl = useIntl();

  return (
    <Textarea
      ariaRequired
      placeholder={intl.formatMessage({
        defaultMessage: 'Dashboard description',
        description: 'create dashboard form description placeholder',
      })}
      onChange={onChange}
      value={value}
    />
  );
}
