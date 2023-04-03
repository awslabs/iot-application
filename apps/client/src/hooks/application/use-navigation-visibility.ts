import { useAtomValue } from 'jotai';
import { isNavigationVisibleAtom } from '~/store/navigation';

/** Use readonly navigation visibility global store. */
export function useNavigationVisibility() {
  return useAtomValue(isNavigationVisibleAtom);
}
