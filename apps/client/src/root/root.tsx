import { Outlet, useNavigate } from 'react-router-dom';
import { Page } from '../page/page';
import { useCrumbs } from '../breadcrumbs/crumbs.hook';
import { usePageType } from '../page/page-type.hook';
import { usePageLocation } from '../page/page-location.hook';

export interface AppProps {
  signOut?: () => void;
}

export const Root = () => {
  const crumbs = useCrumbs();
  const navigate = useNavigate();
  const pageType = usePageType();
  const location = usePageLocation();

  return (
    <Page
      crumbs={crumbs}
      content={<Outlet />}
      pageType={pageType}
      location={location}
      setLocation={navigate}
    />
  );
};
