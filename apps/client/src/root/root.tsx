import { Outlet, useNavigate } from 'react-router-dom';
import { Page } from '../page/page';
import { usePageType } from '../page/page-type.hook';
import { usePageLocation } from '../page/page-location.hook';

export interface AppProps {
  signOut?: () => void;
}

export const Root = () => {
  const navigate = useNavigate();
  const pageType = usePageType();
  const location = usePageLocation();

  return (
    <Page
      content={<Outlet />}
      pageType={pageType}
      location={location}
      setLocation={navigate}
    />
  );
};
