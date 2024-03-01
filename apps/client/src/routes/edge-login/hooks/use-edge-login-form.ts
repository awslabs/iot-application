import { useForm } from 'react-hook-form';

export type EdgeAuthMechanisms = 'linux' | 'ldap';

export interface EdgeLoginFormValues {
  username: string;
  password: string;
  authMechanism: EdgeAuthMechanisms;
}

export const DEFAULT_VALUES: EdgeLoginFormValues = {
  username: '',
  password: '',
  authMechanism: 'linux',
};

export function useEdgeLoginForm() {
  return useForm({ defaultValues: DEFAULT_VALUES });
}
