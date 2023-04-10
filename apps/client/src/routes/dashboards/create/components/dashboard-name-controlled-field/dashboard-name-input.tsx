import Input from '@cloudscape-design/components/input';
import { useIntl } from 'react-intl';

import type { InputProps } from '@cloudscape-design/components/input';

export interface DashboardNameInputProps {
  /** Dashboard name change handler */
  onChange: InputProps['onChange'];
  /** Dashboard name value */
  value: string;
}

/** Displayed input element for dashboard name */
export function DashboardNameInput({
  onChange,
  value,
}: DashboardNameInputProps) {
  const intl = useIntl();

  return (
    <Input
      ariaRequired
      placeholder={intl.formatMessage({
        defaultMessage: 'Dashboard name',
        description: 'create dashboard form name placeholder',
      })}
      onChange={onChange}
      value={value}
    />
  );
}
