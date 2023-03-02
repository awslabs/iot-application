import type { PageCrumb } from '../breadcrumbs/page-crumb.type';
import type { PageType } from '../page/page-type.type';

export interface RouteMatch {
  handle?: { crumbs: PageCrumb[]; pageType: PageType };
  pathname: string;
}
