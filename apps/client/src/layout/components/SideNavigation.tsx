import _SideNavigation from '@cloudscape-design/components/side-navigation';
import { useMatches, useNavigate } from 'react-router-dom';

import messages from 'src/assets/messages';
import { isHandleableWithActiveHref } from 'src/helpers/predicates';
import { MaybeHandleable, MaybeWithActiveHref } from 'src/types';
import invariant from 'tiny-invariant';

function useActiveHref() {
  const matches = useMatches() as MaybeHandleable<MaybeWithActiveHref>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithActiveHref = matches.filter(isHandleableWithActiveHref);
  const lastMatch = matchesWithActiveHref.at(-1);

  invariant(lastMatch != null, 'Expected at least 1 match with active href');

  return lastMatch.handle.activeHref;
}

export function SideNavigation() {
  const navigate = useNavigate();
  const activeHref = useActiveHref();

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
