import type { CollectionPreferencesProps } from '@cloudscape-design/components';
import useLocalStorage from 'react-use/lib/useLocalStorage';

const PREFERENCES_KEY = 'table-preferences';
const DEFAULT_PREFERENCES = {
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
  visibleContent: ['name', 'description', 'lastUpdateDate', 'creationDate'],
};
const NON_PREFERENCES = {
  // ensure that the id column is always visible
  visibleContent: ['id'],
};

/**
 * Hook to get and set table preferences in local storage.
 */
export function useTablePreferences() {
  const [preferences = DEFAULT_PREFERENCES, setPreferences] = useLocalStorage<
    CollectionPreferencesProps<typeof DEFAULT_PREFERENCES>['preferences']
  >(PREFERENCES_KEY, DEFAULT_PREFERENCES);

  return [
    {
      ...preferences,
      visibleContent: [
        ...NON_PREFERENCES.visibleContent,
        ...(preferences.visibleContent ?? []),
      ],
    },
    setPreferences,
  ] as const;
}
