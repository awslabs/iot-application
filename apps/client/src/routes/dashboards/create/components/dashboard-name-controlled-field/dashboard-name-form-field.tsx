import FormField from '@cloudscape-design/components/form-field';
import { useIntl } from 'react-intl';

import { DashboardNameInput } from './dashboard-name-input';
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from '../../constants';

import type { DashboardNameInputProps } from './dashboard-name-input';

interface DashboardNameFormFieldProps extends DashboardNameInputProps {
  /**
   * Displayed when the field is invalid.
   *
   * @see {@link https://cloudscape.design/patterns/general/error-messages/ | Error message pattern} for UX guidance.
   */
  validationErrorMessage?: string;
}

/** Uncontrolled dashboard name form field */
export function DashboardNameFormField({
  onChange,
  validationErrorMessage,
  value,
}: DashboardNameFormFieldProps) {
  const intl = useIntl();

  return (
    <FormField
      label={intl.formatMessage({
        defaultMessage: 'Dashboard name',
        description: 'create dashboard form name label',
      })}
      description={intl.formatMessage({
        defaultMessage: 'Enter the name for your dashboard.',
        description: 'create dashboard form name description',
      })}
      constraintText={intl.formatMessage(
        {
          defaultMessage:
            'Dashboard name must be between {minLength} and {maxLength} characters',
          description: 'create dashboard form name constraint',
        },
        {
          minLength: MIN_NAME_LENGTH,
          maxLength: MAX_NAME_LENGTH,
        },
      )}
      errorText={validationErrorMessage}
    >
      <DashboardNameInput onChange={onChange} value={value} />
    </FormField>
  );
}
