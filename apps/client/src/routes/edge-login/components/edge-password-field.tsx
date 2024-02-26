import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller } from 'react-hook-form';

import type { Control } from 'react-hook-form';
import type { EdgeLoginFormValues } from '../hooks/use-edge-login-form';
import { isJust } from '~/helpers/predicates/is-just';

interface EdgePasswordFieldProps {
  control: Control<EdgeLoginFormValues>;
}

export function EdgePasswordField(props: EdgePasswordFieldProps) {
  return (
    <Controller
      control={props.control}
      name="password"
      rules={{
        required: 'Password is required.',
        maxLength: {
          value: 256,
          message: 'Password must be {maxLength} characters or less.',
        },
      }}
      render={({ field, fieldState }) => (
        <FormField
          label="Password"
          description="The password of your operating system or LDAP user."
          errorText={isJust(fieldState.error) ? fieldState.error.message : ''}
        >
          <Input
            ariaLabel="Enter password"
            onChange={(event) => field.onChange(event.detail.value)}
            value={field.value}
            type="password"
            placeholder="Enter password"
          />
        </FormField>
      )}
    />
  );
}
