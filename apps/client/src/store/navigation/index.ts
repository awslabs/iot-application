import { atom } from 'jotai';

/**
 * Navigation visibility store
 *
 * Do not export.
 */
const isNavigationVisibleBaseAtom = atom(false);

/**
 * Readonly navigation visibility
 *
 * Use for all navigation visibility checks.
 */
export const isNavigationVisibleAtom = atom((get) =>
  get(isNavigationVisibleBaseAtom),
);

/** Set isNavigationVisible in store */
export const setIsNavigationVisibleAtom = atom(
  null,
  (_get, set, isVisible: boolean) => {
    set(isNavigationVisibleBaseAtom, isVisible);
  },
);
