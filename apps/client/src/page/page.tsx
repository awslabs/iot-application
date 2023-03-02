import AppLayout from '@cloudscape-design/components/app-layout';
import React, { ReactNode, useState } from 'react';
import { Navigation } from '../navigation/navigation';
import type { PageType } from '../page/page-type.type';

export const Page: React.FC<{
  content: ReactNode;
  pageType: PageType;
  location: string;
  setLocation: (url: string) => void;
}> = ({ content, pageType, location, setLocation }) => {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <AppLayout
      ariaLabels={{
        navigationClose: 'Close navigation',
        navigationToggle: 'Open navigation',
      }}
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
