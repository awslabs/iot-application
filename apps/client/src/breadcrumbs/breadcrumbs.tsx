import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import React from 'react';

import type { PageCrumb } from './page-crumb.type';
import type { NonEmptyList } from '../types/non-empty-list';

export const Breadcrumbs: React.FC<{
  crumbs: NonEmptyList<PageCrumb>;
  setLocation: (url: string) => void;
}> = ({ crumbs, setLocation }) => {
  const preventPageLoad = (event: Event) => event.preventDefault();

  return (
    <BreadcrumbGroup
      items={crumbs}
      onFollow={(event) => {
        preventPageLoad(event);
        setLocation(event.detail.href);
      }}
    />
  );
};
