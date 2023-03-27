import { useLocalStorage } from 'react-use';

const PREFERENCES_KEY = 'table-preferences';
const DEFAULT_PREFERENCES = {
  pageSize: 10,
  wrapLines: true,
  stripedRows: false,
  visibleContent: ['name', 'description', 'lastUpdateDate'],
};

export function useTablePreferences() {
  const [preferences = DEFAULT_PREFERENCES, setPreferences] = useLocalStorage(
    PREFERENCES_KEY,
    DEFAULT_PREFERENCES,
  );

  return [preferences, setPreferences] as const;
}
