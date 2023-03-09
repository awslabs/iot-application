import Toggle from '@cloudscape-design/components/toggle';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { useEffect } from 'react';
import { useLocalStorage, useMedia } from 'react-use';

type DarkColorScheme = 'dark';
type LightColorScheme = 'light';
type ColorScheme = DarkColorScheme | LightColorScheme;

const COLOR_SCHEME_KEY = 'color-scheme' as const;

function isDarkColorScheme(
  colorScheme: ColorScheme,
): colorScheme is DarkColorScheme {
  return colorScheme === 'dark';
}

export function ColorSchemeToggle() {
  const isLightPreffered = useMedia('(prefers-color-scheme: light)');
  const initialColorScheme: ColorScheme = isLightPreffered ? 'light' : 'dark';

  const [colorScheme = initialColorScheme, setColorScheme] =
    useLocalStorage<ColorScheme>(COLOR_SCHEME_KEY, initialColorScheme);

  useEffect(() => {
    applyMode(isDarkColorScheme(colorScheme) ? Mode.Dark : Mode.Light);
  }, [colorScheme]);

  function toggleColorScheme() {
    return setColorScheme(isDarkColorScheme(colorScheme) ? 'light' : 'dark');
  }

  return (
    <Toggle
      checked={isDarkColorScheme(colorScheme)}
      onChange={toggleColorScheme}
    />
  );
}
