import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller } from 'react-hook-form';

import type { Control } from 'react-hook-form';
import type { EdgeLoginFormValues } from '../hooks/use-edge-login-form';
import { isJust } from '~/helpers/predicates/is-just';

interface EdgeEndpointFieldProps {
  control: Control<EdgeLoginFormValues>;
}

export function EdgeEndpointField(props: EdgeEndpointFieldProps) {
  return (
    <Controller
      control={props.control}
      name="edgeEndpoint"
      rules={{
        required: 'Hostname is required.',
        maxLength: {
          value: 256, // Hostname can be max 253 ASCII characters
          message: 'Hostname must be {maxLength} characters or less.',
        },
      }}
      render={({ field, fieldState }) => (
        <FormField
          label="Hostname or IP address"
          description="The hostname or IP adddress of the gateway device."
          errorText={isJust(fieldState.error) ? fieldState.error.message : ''}
        >
          <Input
            ariaLabel="Enter hostname or IP address"
            onChange={(event) => field.onChange(event.detail.value)}
            value={field.value}
            placeholder="Enter hostname or IP address"
          />
        </FormField>
      )}
    />
  );
}
