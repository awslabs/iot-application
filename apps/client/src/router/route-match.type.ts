import type { PageType } from '../page/page-type.type';

export interface RouteMatch {
  handle?: { pageType: PageType };
  pathname: string;
}
