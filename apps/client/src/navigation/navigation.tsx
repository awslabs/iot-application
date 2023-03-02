import SideNavigation from '@cloudscape-design/components/side-navigation';
import React from 'react';

export const Navigation: React.FC<{
  location: string;
  setLocation: (url: string) => void;
}> = ({ location, setLocation }) => {
  const preventPageLoad = (event: Event) => event.preventDefault();

  return (
    <SideNavigation
      activeHref={location}
      header={{ href: '/', text: 'IoT Application' }}
      items={[{ type: 'link', href: '/dashboards', text: 'Dashboards' }]}
      onFollow={(event) => {
        preventPageLoad(event);
        setLocation(event.detail.href);
      }}
    />
  );
};
