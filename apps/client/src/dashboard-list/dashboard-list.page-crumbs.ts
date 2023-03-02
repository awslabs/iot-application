import type { PageCrumb } from '../breadcrumbs/page-crumb.type';

export const DASHBOARD_LIST_PAGE_CRUMBS: PageCrumb[] = [
  { text: 'Dashboards', href: '/dashboards' },
  // TODO: Replace with real dashboard name once resource is being loaded
  { text: 'Dashboard Name', href: 'no-op' }, // no link needed for deepest resource
];
