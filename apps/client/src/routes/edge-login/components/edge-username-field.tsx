import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller } from 'react-hook-form';

import type { Control } from 'react-hook-form';
import type { EdgeLoginFormValues } from '../hooks/use-edge-login-form';
import { isJust } from '~/helpers/predicates/is-just';

interface EdgeUsernameFieldProps {
  control: Control<EdgeLoginFormValues>;
}

export function EdgeUsernameField(props: EdgeUsernameFieldProps) {
  return (
    <Controller
      control={props.control}
      name="username"
      rules={{
        required: 'Username is required.',
        maxLength: {
          value: 256,
          message: 'Username must be {maxLength} characters or less.',
        },
      }}
      render={({ field, fieldState }) => (
        <FormField
          label="Username"
          description="The user name of your operating system or LDAP."
          errorText={isJust(fieldState.error) ? fieldState.error.message : ''}
        >
          <Input
            ariaLabel="Enter username"
            onChange={(event) => field.onChange(event.detail.value)}
            value={field.value}
            placeholder="Enter username"
          />
        </FormField>
      )}
    />
  );
}
