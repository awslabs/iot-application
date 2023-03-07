import SideNavigation from '@cloudscape-design/components/side-navigation';
import { useNavigate } from 'react-router-dom';

import messages from '../../../assets/messages';

interface Props {
  activeHref: string;
}

export function Navigation({ activeHref }: Props) {
  const navigate = useNavigate();

  return (
    <SideNavigation
      activeHref={activeHref}
      header={{ href: '/', text: messages.appName }}
      items={[
        {
          type: 'link',
          href: '/dashboards',
          text: messages.dashboards,
        },
      ]}
      onFollow={(event) => {
        event.preventDefault();
        navigate(event.detail.href);
      }}
    />
  );
}
