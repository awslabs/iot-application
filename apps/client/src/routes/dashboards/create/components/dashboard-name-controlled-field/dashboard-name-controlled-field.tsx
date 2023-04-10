import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { DashboardNameFormField } from './dashboard-name-form-field';
import { MAX_NAME_LENGTH } from '../../constants';

import type { Control } from 'react-hook-form';
import type { CreateDashboardFormValues } from '../../types/create-dashboard-form-values';

interface DashboardNameControlledFieldProps {
  /** `react-hook-form` `controller` instance returned from `useForm` */
  control: Control<CreateDashboardFormValues>;
}

/** Controlled dashboard name form field */
export function DashboardNameControlledField({
  control,
}: DashboardNameControlledFieldProps) {
  const intl = useIntl();

  return (
    <Controller
      control={control}
      name="name"
      rules={{
        required: intl.formatMessage({
          defaultMessage: 'Dashboard name is required.',
          description: 'create dashboard form name required',
        }),
        maxLength: {
          value: MAX_NAME_LENGTH,
          message: intl.formatMessage(
            {
              defaultMessage:
                'Dashboard name must be {maxLength} characters or less.',
              description: 'create dashboard form name max length',
            },
            { maxLength: MAX_NAME_LENGTH },
          ),
        },
      }}
      render={({ field, fieldState }) => (
        <DashboardNameFormField
          onChange={(event) => field.onChange(event.detail.value)}
          validationErrorMessage={fieldState.error?.message}
          value={field.value}
        />
      )}
    />
  );
}
