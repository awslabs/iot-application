import { Outlet, useNavigate } from 'react-router-dom';
import { Page } from '../page/page';
import { usePageType } from '../page/page-type.hook';
import { usePageLocation } from '../page/page-location.hook';
import { Button } from '@cloudscape-design/components';

export interface AppProps {
  signOut?: () => void;
}

export const Root = ({ signOut }: AppProps) => {
  const navigate = useNavigate();
  const pageType = usePageType();
  const location = usePageLocation();

  const PageContent = () => {
    return (
      <>
        {signOut && (
          <Button key={'signout'} onClick={signOut}>
            Sign out
          </Button>
        )}
        <Outlet />
      </>
    );
  };

  return (
    <Page
      content={<PageContent />}
      pageType={pageType}
      location={location}
      setLocation={navigate}
    />
  );
};
