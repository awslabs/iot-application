import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { $Dashboard } from '~/services';

import type { Control } from 'react-hook-form';
import type { CreateDashboardFormValues } from '../types/create-dashboard-form-values';
import { isJust } from '~/helpers/predicates/is-just';
import { Link } from '@cloudscape-design/components';

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
            defaultMessage: 'Name',
            description: 'create dashboard form name label',
          })}
          info={<Link variant="info">Info</Link>}
          constraintText={intl.formatMessage(
            {
              defaultMessage:
                'Name must be alphanumeric, unique and fewer than 63 characters, It can include hyphen(-) and spaces.',
              description: 'create dashboard form name constraint',
            },
            {
              minLength: $Dashboard.properties.name.minLength,
              maxLength: $Dashboard.properties.name.maxLength,
            },
          )}
          errorText={isJust(fieldState.error) ? fieldState.error.message : ''}
        >
          <Input
            ariaRequired
            placeholder={intl.formatMessage({
              defaultMessage: 'dashboard name',
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
