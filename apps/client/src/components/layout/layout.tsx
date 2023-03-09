import AppLayout, {
  AppLayoutProps,
} from '@cloudscape-design/components/app-layout';

import {
  useBreadcrumbs,
  BreadcrumbsProps,
  useNotifications,
  useSideNavigation,
} from 'src/components';

interface Props {
  activeHref: string;
  crumbs: BreadcrumbsProps['crumbs'];
  type: AppLayoutProps['contentType'];
}

export function Layout({
  activeHref,
  children,
  crumbs,
  type,
}: Props & React.PropsWithChildren) {
  const { Breadcrumbs } = useBreadcrumbs(crumbs);
  const { Notifications } = useNotifications();
  const { SideNavigation, ...navigationProps } = useSideNavigation(activeHref);

  return (
    <AppLayout
      {...navigationProps}
      breadcrumbs={<Breadcrumbs />}
      content={children}
      contentType={type}
      navigation={<SideNavigation />}
      notifications={<Notifications />}
      toolsHide={true}
    />
  );
}
