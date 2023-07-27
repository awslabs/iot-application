import { ContentDensity } from '~/types';

export const DEFAULT_LOCALE = 'en';

export const ROOT_PATH = '/';
export const DASHBOARDS_PATH = 'dashboards';
export const CREATE_PATH = 'create';
export const DASHBOARD_PATH = ':dashboardId';

// Add the corresponding routes under apps/core/src/mvc/mvc.controller.ts to support browser router.
export const ROOT_HREF = '/';
export const DASHBOARDS_HREF = '/dashboards';
export const CREATE_DASHBOARD_HREF = '/dashboards/create';

export const DEFAULT_CONTENT_DENSITY: ContentDensity = 'comfortable';
export const CONTENT_DENSITY_KEY = 'content-density';
