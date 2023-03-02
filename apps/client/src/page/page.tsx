import AppLayout from '@cloudscape-design/components/app-layout';
import React, { ReactNode, useState } from 'react';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { Navigation } from '../navigation/navigation';
import type { PageCrumb } from '../breadcrumbs/page-crumb.type';
import type { PageType } from '../page/page-type.type';
import { NonEmptyList } from '../types/non-empty-list';

export const Page: React.FC<{
  content: ReactNode;
  crumbs: NonEmptyList<PageCrumb>;
  pageType: PageType;
  location: string;
  setLocation: (url: string) => void;
}> = ({ crumbs, content, pageType, location, setLocation }) => {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <AppLayout
      ariaLabels={{
        navigationClose: 'Close navigation',
        navigationToggle: 'Open navigation',
      }}
      breadcrumbs={<Breadcrumbs crumbs={crumbs} setLocation={setLocation} />}
      content={content}
      contentType={pageType}
      navigationOpen={navigationOpen}
      onNavigationChange={(event) => {
        setNavigationOpen(event.detail.open);
      }}
      navigation={<Navigation location={location} setLocation={setLocation} />}
      toolsHide={true}
    />
  );
};
