import { useForm } from 'react-hook-form';

import type { CreateDashboardFormValues } from '../types/create-dashboard-form-values';

const DEFAULT_VALUES: CreateDashboardFormValues = { name: '', description: '' };

export function useCreateDashboardForm() {
  return useForm({ defaultValues: DEFAULT_VALUES });
}
