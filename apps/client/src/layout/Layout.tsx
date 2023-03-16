import { AppLayout } from '@cloudscape-design/components';
import { useMatches } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { Breadcrumbs } from './components/Breadcrumbs';
import { Notifications } from './components/Notifications';
import { SideNavigation } from './components/SideNavigation';
import { TopNavigation } from './components/TopNavigation';
import {
  isHandleableWithFormat,
  isListWithSingleItem,
} from 'src/helpers/predicates';
import type { MaybeFormatted, MaybeHandleable } from 'src/types';

function useFormat() {
  const matches = useMatches() as MaybeHandleable<MaybeFormatted>[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithFormat = matches.filter(isHandleableWithFormat);

  if (!isListWithSingleItem(matchesWithFormat)) {
    invariant(false, 'Expected only 1 match with format');
  }

  return matchesWithFormat[0].handle.format;
}

export function Layout(props: React.PropsWithChildren) {
  const format = useFormat();

  return (
    <>
      <TopNavigation />
      <AppLayout
        breadcrumbs={<Breadcrumbs />}
        content={props.children}
        contentType={format}
        navigation={<SideNavigation />}
        notifications={<Notifications />}
        toolsHide={true}
      />
    </>
  );
}
