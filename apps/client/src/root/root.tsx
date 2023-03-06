import { Outlet, useNavigate } from 'react-router-dom';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Page } from '../page/page';
import { useCrumbs } from '../breadcrumbs/crumbs.hook';
import { usePageType } from '../page/page-type.hook';
import { usePageLocation } from '../page/page-location.hook';

// singleton
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      // TODO: handle error
      console.log(error);
    },
  }),
});

export const Root = () => {
  const crumbs = useCrumbs();
  const navigate = useNavigate();
  const pageType = usePageType();
  const location = usePageLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <Page
        crumbs={crumbs}
        content={<Outlet />}
        pageType={pageType}
        location={location}
        setLocation={navigate}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
