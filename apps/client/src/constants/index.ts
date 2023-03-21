import { ContentDensity } from '~/types';

export const DEFAULT_LOCALE = 'en' as const;

export const ROOT_PATH = '/' as const;
export const DASHBOARDS_PATH = 'dashboards' as const;
export const CREATE_PATH = 'create' as const;
export const DASHBOARD_PATH = ':dashboardId' as const;

export const ROOT_HREF = '/' as const;
export const DASHBOARDS_HREF = '/dashboards' as const;
export const CREATE_DASHBOARD_HREF = '/dashboards/create' as const;

export const DEFAULT_CONTENT_DENSITY: ContentDensity = 'comfortable';
export const CONTENT_DENSITY_KEY = 'content-density' as const;
