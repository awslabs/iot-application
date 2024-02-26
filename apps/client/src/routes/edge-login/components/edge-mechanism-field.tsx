import FormField from '@cloudscape-design/components/form-field';
import { Controller } from 'react-hook-form';

import type { Control } from 'react-hook-form';
import type { EdgeLoginFormValues } from '../hooks/use-edge-login-form';
import Select from '@cloudscape-design/components/select';

interface EdgeMechanismFieldProps {
  control: Control<EdgeLoginFormValues>;
}

const authOptions = [
  { label: 'Linux', value: 'linux' },
  { label: 'LDAP', value: 'ldap' },
];

const valueToLabel = {
  linux: 'Linux',
  ldap: 'LDAP',
};

export function EdgeMechanismField(props: EdgeMechanismFieldProps) {
  return (
    <Controller
      control={props.control}
      name="authMechanism"
      render={({ field }) => (
        <FormField
          label="Authentication type"
          description="You can authenticate to this gateway with your Operating System Authentication or Lightweight Directory Access Protocol (LDAP) credentials."
        >
          <Select
            ariaLabel="Select an authentication type"
            onChange={(event) =>
              field.onChange(event.detail.selectedOption.value)
            }
            selectedOption={{
              label: valueToLabel[field.value],
              value: field.value,
            }}
            options={authOptions}
          />
        </FormField>
      )}
    />
  );
}
