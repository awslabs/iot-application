import { useSetAtom } from 'jotai';
import { setIsNavigationVisibleAtom } from '~/store/navigation';

/** Use write-only navigation visibility global store. */
export function useSetNavigationVisibility() {
  return useSetAtom(setIsNavigationVisibleAtom);
}
