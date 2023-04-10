import FormField from '@cloudscape-design/components/form-field';
import { useIntl } from 'react-intl';

import { DashboardDescriptionTextarea } from './dashboard-description-textarea';
import {
  MAX_DESCRIPTION_LENGTH,
  MIN_DESCRIPTION_LENGTH,
} from '../../constants';

import type { DashboardDescriptionTextareaProps } from './dashboard-description-textarea';

interface DashboardDescriptionFormFieldProps
  extends DashboardDescriptionTextareaProps {
  /**
   * Displayed when the field is invalid.
   *
   * @see {@link https://cloudscape.design/patterns/general/error-messages/ | Error message pattern} for UX guidance.
   */
  validationErrorMessage?: string;
}

/** Uncontrolled dashboard description form field */
export function DashboardDescriptionFormField({
  onChange,
  validationErrorMessage,
  value,
}: DashboardDescriptionFormFieldProps) {
  const intl = useIntl();

  return (
    <FormField
      label={intl.formatMessage({
        defaultMessage: 'Dashboard description',
        description: 'create dashboard form description label',
      })}
      description={intl.formatMessage({
        defaultMessage: 'Enter the description for your dashboard.',
        description: 'create dashboard form description description',
      })}
      constraintText={intl.formatMessage(
        {
          defaultMessage:
            'Dashboard description must be between {minLength} and {maxLength} characters',
          description: 'create dashboard form description constraint',
        },
        {
          minLength: MIN_DESCRIPTION_LENGTH,
          maxLength: MAX_DESCRIPTION_LENGTH,
        },
      )}
      errorText={validationErrorMessage}
    >
      <DashboardDescriptionTextarea onChange={onChange} value={value} />
    </FormField>
  );
}
