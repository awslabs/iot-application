import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import { useMatches, useNavigate } from 'react-router-dom';
import {
  isHandleableWithCrumbData,
  isHandleableWithCrumbs,
} from 'src/helpers/predicates';
import { MaybeCrumbly, MaybeDataBound, MaybeHandleable } from 'src/types';
import invariant from 'tiny-invariant';

function useCrumbs<T>() {
  const matches = useMatches() as (MaybeDataBound<T> &
    MaybeHandleable<MaybeCrumbly<T>>)[];

  invariant(matches.length >= 1, 'Expected at least 1 match');

  const matchesWithCrumbs = matches.filter(isHandleableWithCrumbs);

  invariant(
    matchesWithCrumbs.length >= 1,
    'Expected at least 1 match with crumbs',
  );

  return matchesWithCrumbs.map((m) =>
    isHandleableWithCrumbData(m) ? m.handle.crumb(m.data) : m.handle.crumb(),
  );
}

export function Breadcrumbs() {
  const navigate = useNavigate();
  const crumbs = useCrumbs();

  return (
    <BreadcrumbGroup
      items={crumbs}
      onFollow={(event) => {
        event.preventDefault();
        navigate(event.detail.href);
      }}
    />
  );
}
