import FormField from '@cloudscape-design/components/form-field';
import Textarea from '@cloudscape-design/components/textarea';
import { Controller } from 'react-hook-form';
import { useIntl } from 'react-intl';

import { $Dashboard } from '~/services';

import type { Control } from 'react-hook-form';
import { CreateDashboardFormValues } from '../types/create-dashboard-form-values';
import { isJust } from '~/helpers/predicates/is-just';

interface DashboardDescriptionFieldProps {
  control: Control<CreateDashboardFormValues>;
}

export function DashboardDescriptionField(
  props: DashboardDescriptionFieldProps,
) {
  const intl = useIntl();

  return (
    <Controller
      control={props.control}
      name="description"
      rules={{
        required: intl.formatMessage({
          defaultMessage: 'Dashboard description is required.',
          description: 'create dashboard form description required',
        }),
        maxLength: {
          value: $Dashboard.properties.description.maxLength,
          message: intl.formatMessage(
            {
              defaultMessage:
                'Dashboard description must be {maxLength} characters or less.',
              description: 'create dashboard form description max length',
            },
            {
              maxLength: $Dashboard.properties.description.maxLength,
            },
          ),
        },
      }}
      render={({ field, fieldState }) => (
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
              minLength: $Dashboard.properties.description.minLength,
              maxLength: $Dashboard.properties.description.maxLength,
            },
          )}
          errorText={isJust(fieldState.error) ? fieldState.error.message : ''}
        >
          <Textarea
            ariaRequired
            placeholder={intl.formatMessage({
              defaultMessage: 'Dashboard description',
              description: 'create dashboard form description placeholder',
            })}
            onChange={(event) => field.onChange(event.detail.value)}
            value={field.value}
          />
        </FormField>
      )}
    />
  );
}
