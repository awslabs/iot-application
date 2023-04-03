import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { $Dashboard } from '~/services';

import type { Control } from 'react-hook-form';
import type { CreateDashboardFormValues } from '../types/create-dashboard-form-values';

interface DashboardNameFieldProps {
  control: Control<CreateDashboardFormValues>;
}

export function DashboardNameField(props: DashboardNameFieldProps) {
  const intl = useIntl();

  return (
    <Controller
      control={props.control}
      name="name"
      rules={{
        required: intl.formatMessage({
          defaultMessage: 'Dashboard name is required.',
          description: 'create dashboard form name required',
        }),
        maxLength: {
          value: $Dashboard.properties.name.maxLength,
          message: intl.formatMessage(
            {
              defaultMessage:
                'Dashboard name must be {maxLength} characters or less.',
              description: 'create dashboard form name max length',
            },
            { maxLength: $Dashboard.properties.name.maxLength },
          ),
        },
      }}
      render={({ field, fieldState }) => (
        <FormField
          label={intl.formatMessage({
            defaultMessage: 'Dashboard name',
            description: 'create dashboard form name label',
          })}
          description={intl.formatMessage({
            defaultMessage: 'Enter the name you want to give your dashboard.',
            description: 'create dashboard form name description',
          })}
          constraintText={intl.formatMessage(
            {
              defaultMessage:
                'Dashboard name must be between {minLength} and {maxLength} characters',
              description: 'create dashboard form name constraint',
            },
            {
              minLength: $Dashboard.properties.name.minLength,
              maxLength: $Dashboard.properties.name.maxLength,
            },
          )}
          errorText={fieldState.error?.message}
        >
          <Input
            ariaRequired
            autoFocus
            placeholder={intl.formatMessage({
              defaultMessage: 'Dashboard name',
              description: 'create dashboard form name placeholder',
            })}
            onChange={(event) => field.onChange(event.detail.value)}
            value={field.value}
          />
        </FormField>
      )}
    />
  );
}
