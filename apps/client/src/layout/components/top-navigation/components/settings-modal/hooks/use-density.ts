import { applyDensity, Density } from '@cloudscape-design/global-styles';
import useLocalStorage from 'react-use/lib/useLocalStorage';

import { isComfortable } from '../helpers/is-comfortable';
import { CONTENT_DENSITY_KEY, DEFAULT_CONTENT_DENSITY } from '~/constants';

import type { ContentDensity } from '~/types';

const CONTENT_DENSITY_INITIALIZER = DEFAULT_CONTENT_DENSITY;

export function useDensity() {
  const [density = DEFAULT_CONTENT_DENSITY, setDensity] =
    useLocalStorage<ContentDensity>(
      CONTENT_DENSITY_KEY,
      CONTENT_DENSITY_INITIALIZER,
    );

  const densitySetting = isComfortable(density)
    ? Density.Comfortable
    : Density.Compact;

  applyDensity(densitySetting);

  return [density, setDensity] as const;
}
