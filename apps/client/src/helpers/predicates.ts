import type { ReadonlyTuple } from 'type-fest';
import type {
  Crumbly,
  DataBound,
  Dimensional,
  Formatted,
  Handleable,
  Identifiable,
  Just,
  Maybe,
  MaybeCrumbly,
  MaybeDataBound,
  MaybeDimensional,
  MaybeFormatted,
  MaybeHandleable,
  MaybeWithActiveHref,
  NonEmptyList,
  Nothing,
  WithActiveHref,
} from '~/types';

export function isHandleable<T>(
  maybe: MaybeHandleable<T>,
): maybe is Handleable<T> {
  return Boolean(maybe.handle);
}

export function isCrumbly<T>(maybe: MaybeCrumbly<T>): maybe is Crumbly<T> {
  return Boolean(maybe.crumb);
}

export function isDataBound<T>(
  maybe: MaybeDataBound<T>,
): maybe is DataBound<T> {
  return Boolean(maybe.data);
}

export function isDimensional(maybe: MaybeDimensional): maybe is Dimensional {
  return Boolean(maybe.fullWidth);
}

export function isFormatted(maybe: MaybeFormatted): maybe is Formatted {
  return Boolean(maybe.format);
}

export function isWithActiveHref(
  maybe: MaybeWithActiveHref,
): maybe is WithActiveHref {
  return Boolean(maybe.activeHref);
}

export function isHandleableWithActiveHref(
  maybe: MaybeHandleable<MaybeWithActiveHref>,
): maybe is Handleable<WithActiveHref> {
  return isHandleable(maybe) && isWithActiveHref(maybe.handle);
}

export function isHandleableWithCrumbs<T>(
  maybe: MaybeHandleable<MaybeCrumbly<T>>,
): maybe is Handleable<Crumbly<T>> {
  return isHandleable(maybe) && isCrumbly(maybe.handle);
}

export function isHandleableWithDimensions(
  maybe: MaybeHandleable<MaybeDimensional>,
): maybe is Handleable<Dimensional> {
  return isHandleable(maybe) && isDimensional(maybe.handle);
}

export function isHandleableWithFormat(
  maybe: MaybeHandleable<MaybeFormatted>,
): maybe is Handleable<Formatted> {
  return isHandleable(maybe) && isFormatted(maybe.handle);
}

export function isHandleableWithCrumbData<T>(
  maybe: MaybeDataBound<T> & MaybeHandleable<MaybeCrumbly<T>>,
): maybe is DataBound<T> & Handleable<Crumbly<T>> {
  const dataBound = isDataBound(maybe);
  const crumbly = isHandleableWithCrumbs(maybe);

  return dataBound && crumbly;
}

export function isListWithSingleItem<T>(
  list: Readonly<T[]>,
): list is ReadonlyTuple<T, 1> {
  return list.length === 1;
}

export function isSameIdentifiable(a: Identifiable) {
  return (b: Identifiable) => {
    return a.id === b.id;
  };
}

export function isJust<T>(maybe: Maybe<T>): maybe is Just<T> {
  return maybe != null;
}

export function isNothing<T>(maybe: Maybe<T>): maybe is Nothing {
  return !isJust(maybe);
}

export function isNonEmptyList<T>(maybe: T[]): maybe is NonEmptyList<T> {
  return maybe.length >= 1;
}
