import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { DashboardDescriptionFormField } from './dashboard-description-form-field';
import { MAX_DESCRIPTION_LENGTH } from '../../constants';

import type { Control } from 'react-hook-form';
import type { CreateDashboardFormValues } from '../../types/create-dashboard-form-values';

interface DashboardDescriptionControlledFieldProps {
  /** `react-hook-form` `controller` instance returned from `useForm` */
  control: Control<CreateDashboardFormValues>;
}

/** Controlled dashboard description form field */
export function DashboardDescriptionControlledField({
  control,
}: DashboardDescriptionControlledFieldProps) {
  const intl = useIntl();

  return (
    <Controller
      control={control}
      name="description"
      rules={{
        required: intl.formatMessage({
          defaultMessage: 'Dashboard description is required.',
          description: 'create dashboard form description required',
        }),
        maxLength: {
          value: MAX_DESCRIPTION_LENGTH,
          message: intl.formatMessage(
            {
              defaultMessage:
                'Dashboard description must be {maxLength} characters or less.',
              description: 'create dashboard form description max length',
            },
            {
              maxLength: MAX_DESCRIPTION_LENGTH,
            },
          ),
        },
      }}
      render={({ field, fieldState }) => (
        <DashboardDescriptionFormField
          onChange={(event) => field.onChange(event.detail.value)}
          validationErrorMessage={fieldState.error?.message}
          value={field.value}
        />
      )}
    />
  );
}
