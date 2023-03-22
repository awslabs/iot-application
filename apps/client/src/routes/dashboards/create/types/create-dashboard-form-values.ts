import type { Dashboard } from '~/services';

export type CreateDashboardFormValues = Pick<Dashboard, 'name' | 'description'>;
