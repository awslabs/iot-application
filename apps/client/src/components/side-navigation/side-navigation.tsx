import _SideNavigation from '@cloudscape-design/components/side-navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import messages from '../../assets/messages';

export type IsNavOpen = boolean;
export type SetIsNavOpen = Dispatch<SetStateAction<IsNavOpen>>;

export const SideNavigationContext = createContext<IsNavOpen>(false);
export const SideNavigationSetContext = createContext<SetIsNavOpen>(
  () => undefined,
);

export function useSideNavigation(activeHref: string) {
  const isNavOpen = useContext(SideNavigationContext);
  const setIsNavOpen = useContext(SideNavigationSetContext);

  return {
    SideNavigation: () => <SideNavigation activeHref={activeHref} />,
    navigationOpen: isNavOpen,
    onNavigationChange: () => setIsNavOpen((isOpen) => !isOpen),
  };
}

export function SideNavigationProvider({ children }: React.PropsWithChildren) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <SideNavigationContext.Provider value={isNavOpen}>
      <SideNavigationSetContext.Provider value={setIsNavOpen}>
        {children}
      </SideNavigationSetContext.Provider>
    </SideNavigationContext.Provider>
  );
}

export interface SideNavigationProps {
  activeHref: string;
}

export function SideNavigation({ activeHref }: SideNavigationProps) {
  const navigate = useNavigate();

  return (
    <_SideNavigation
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
