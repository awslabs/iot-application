import type { RouteObject } from 'react-router-dom';

import type { Crumbly } from './crumb';
import type { Formatted } from './format';
import type { Handleable } from './handle';
import { WithActiveHref } from './href';

export type Route = Omit<RouteObject, 'handle'>;

export type FormattedRoute = Route & Handleable<Formatted>;

export type CrumblyRoute<T = void> = Route & Handleable<Crumbly<T>>;

export type ActiveHrefRoute = Route & Handleable<WithActiveHref>;
