/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardDefinition } from './DashboardDefinition';

export type Dashboard = {
  id: string;
  name: string;
  description: string;
  definition: DashboardDefinition;
  isFavorite: boolean;
};
